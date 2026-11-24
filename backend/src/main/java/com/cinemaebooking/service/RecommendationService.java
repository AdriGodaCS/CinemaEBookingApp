package com.cinemaebooking.service;

import com.cinemaebooking.model.booking.Booking;
import com.cinemaebooking.model.movie.Movie;
import com.cinemaebooking.model.recommendation.Recommendation;
import com.cinemaebooking.model.recommendation.RecommendedMovie;
import com.cinemaebooking.repository.RecommendationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            ObjectMapper objectMapper) {
        this.recommendationRepository = recommendationRepository;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newHttpClient();
    }

    public Recommendation getUserRecommendation(Integer customerId) {
        return recommendationRepository.findByCustomerId(customerId)
                .orElse(null);
    }

    public String formulatePrompt(
            List<Movie> favoriteMovies,
            List<Booking> bookingHistory,
            List<Movie> allMovies) {
        try {
            return "You are a movie recommendation engine. "
                    + "Recommend movies only from the AVAILABLE MOVIES list. "
                    + "Use the customer's FAVORITE MOVIES and BOOKING HISTORY as preference signals. "
                    + "Do not recommend a movie that is not in the available list. "
                    + "Return ONLY valid JSON with this exact shape: "
                    + "{\"recommendations\":[{\"movie_id\":5,\"reason\":\"Based on favorites\"}]} . "
                    + "The recommendations array may be empty, and each reason must briefly explain "
                    + "whether the recommendation is based on favorites or booking activity.\n\n"
                    + "FAVORITE MOVIES:\n"
                    + objectMapper.writeValueAsString(summarizeMovies(favoriteMovies))
                    + "\n\nBOOKING HISTORY:\n"
                    + objectMapper.writeValueAsString(summarizeBookings(bookingHistory))
                    + "\n\nAVAILABLE MOVIES:\n"
                    + objectMapper.writeValueAsString(summarizeMovies(allMovies));
        } catch (IOException e) {
            throw new IllegalStateException("Could not formulate the recommendation prompt.", e);
        }
    }

    public Recommendation generateRecommendations(
            Integer customerId,
            List<Movie> favoriteMovies,
            List<Booking> bookingHistory,
            List<Movie> allMovies) {
        String apiKey = getEnvironmentValue("GEMINI_API_KEY");
        String model = getEnvironmentValue("GEMINI_MODEL");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY was not found in .env.");
        }
        if (model == null || model.isBlank()) {
            model = "gemini-2.0-flash";
        }

        try {
            String prompt = formulatePrompt(favoriteMovies, bookingHistory, allMovies);
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt)))),
                    "generationConfig", Map.of(
                            "responseMimeType", "application/json"));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(
                            "https://generativelanguage.googleapis.com/v1beta/models/"
                                    + model + ":generateContent"))
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(
                            objectMapper.writeValueAsString(requestBody)))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException(
                        "Gemini returned HTTP " + response.statusCode() + ".");
            }

            List<RecommendedMovie> recommendations = parseRecommendations(
                    response.body(),
                    movieIds(allMovies));

            Recommendation recommendation = recommendationRepository
                    .findByCustomerId(customerId)
                    .orElseGet(() -> {
                        Recommendation newRecommendation = new Recommendation();
                        newRecommendation.setId(recommendationRepository
                                .findTopByOrderByIdDesc()
                                .map(existing -> existing.getId() + 1)
                                .orElse(1));
                        newRecommendation.setCustomerId(customerId);
                        return newRecommendation;
                    });

            recommendation.setGeneratedAt(Instant.now().toString());
            recommendation.setRecommendations(recommendations);

            return recommendationRepository.save(recommendation);
        } catch (IOException e) {
            throw new IllegalStateException("Could not get recommendations from Gemini.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Could not get recommendations from Gemini.", e);
        }
    }

    private List<RecommendedMovie> parseRecommendations(
            String responseBody,
            Set<Integer> availableMovieIds) throws IOException {
        JsonNode response = objectMapper.readTree(responseBody);
        JsonNode textNode = response.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text");

        if (!textNode.isTextual()) {
            throw new IllegalStateException("Gemini returned no recommendation JSON.");
        }

        String json = textNode.asText()
                .replaceFirst("^```json\\s*", "")
                .replaceFirst("\\s*```$", "")
                .trim();
        JsonNode recommendationsNode = objectMapper.readTree(json);
        if (recommendationsNode.isObject()) {
            recommendationsNode = recommendationsNode.path("recommendations");
        }

        if (!recommendationsNode.isArray()) {
            throw new IllegalStateException("Gemini returned an invalid recommendations array.");
        }

        List<RecommendedMovie> recommendations = new ArrayList<>();
        for (JsonNode item : recommendationsNode) {
            RecommendedMovie recommendation = objectMapper.treeToValue(
                    item,
                    RecommendedMovie.class);
            if (recommendation.getMovieId() != null
                    && availableMovieIds.contains(recommendation.getMovieId())) {
                recommendations.add(recommendation);
            }
        }
        return recommendations;
    }

    private List<Map<String, Object>> summarizeMovies(List<Movie> movies) {
        List<Map<String, Object>> summary = new ArrayList<>();
        for (Movie movie : safeList(movies)) {
            if (movie != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("movie_id", movie.getId());
                item.put("title", movie.getTitle());
                item.put("genre", movie.getGenre());
                item.put("description", movie.getDescription());
                summary.add(item);
            }
        }
        return summary;
    }

    private List<Map<String, Object>> summarizeBookings(List<Booking> bookings) {
        List<Map<String, Object>> summary = new ArrayList<>();
        for (Booking booking : safeList(bookings)) {
            if (booking != null) {
                Map<String, Object> item = new HashMap<>();
                item.put("movie_id", booking.getMovieId());
                item.put("show_id", booking.getShowId());
                item.put("show_date", booking.getShowDate());
                item.put("status", booking.getStatus());
                summary.add(item);
            }
        }
        return summary;
    }

    private Set<Integer> movieIds(List<Movie> movies) {
        Set<Integer> ids = new HashSet<>();
        for (Movie movie : safeList(movies)) {
            if (movie != null && movie.getId() != null) {
                ids.add(movie.getId());
            }
        }
        return ids;
    }

    private <T> List<T> safeList(List<T> values) {
        return values == null ? List.of() : values;
    }

    private String getEnvironmentValue(String key) {
        String value = System.getenv(key);
        if (value != null && !value.isBlank()) {
            return value;
        }
        return Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load()
                .get(key);
    }
}
