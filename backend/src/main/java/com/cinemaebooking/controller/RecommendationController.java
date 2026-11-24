package com.cinemaebooking.controller;

import com.cinemaebooking.model.booking.Booking;
import com.cinemaebooking.model.movie.Movie;
import com.cinemaebooking.model.recommendation.Recommendation;
import com.cinemaebooking.service.BookingService;
import com.cinemaebooking.service.MovieService;
import com.cinemaebooking.service.RecommendationService;
import com.cinemaebooking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserService userService;
    private final BookingService bookingService;
    private final MovieService movieService;

    public RecommendationController(
            RecommendationService recommendationService,
            UserService userService,
            BookingService bookingService,
            MovieService movieService) {
        this.recommendationService = recommendationService;
        this.userService = userService;
        this.bookingService = bookingService;
        this.movieService = movieService;
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<?> getUserRecommendation(
            @PathVariable Integer customerId) {
        Recommendation recommendation = recommendationService
                .getUserRecommendation(customerId);

        if (recommendation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Recommendation not found."));
        }

        return ResponseEntity.ok(recommendation);
    }

    @PostMapping("/{customerId}/generate")
    public ResponseEntity<?> generateRecommendations(
            @PathVariable Integer customerId) {
        try {
            List<Movie> favoriteMovies = userService
                    .getFavoriteMovies(customerId);
            List<Booking> bookingHistory = bookingService
                    .getOrderHistory(customerId);
            List<Movie> allMovies = movieService.getAllMovies();

            Recommendation recommendation = recommendationService
                    .generateRecommendations(
                            customerId,
                            favoriteMovies,
                            bookingHistory,
                            allMovies);

            return ResponseEntity.ok(recommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
