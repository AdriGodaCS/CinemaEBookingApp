package com.cinemaebooking.service;


import com.cinemaebooking.model.movie.Movie;
import com.cinemaebooking.model.movie.CreateMovieRequest;
import com.cinemaebooking.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieById(Integer id) {
        return movieRepository.findById(id).orElse(null);
    }

    public Movie getMovieByTitle(String title) {
        return movieRepository.findByTitle(title);
    }

    public List<Movie> findByTitleContainingIgnoreCase(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    public List<Movie> getMoviesByStatus(String status) {
        return movieRepository.findByStatus(status);
    }

    public Movie createMovie(CreateMovieRequest movieRequest) {
        Movie movie = new Movie();

        // Retrieve next available id for the new Movie
        Integer nextId = movieRepository.findTopByOrderByIdDesc()
                                .map(existingMovie -> existingMovie.getId() + 1)
                                .orElse(1);

        // Transfer data from request DTO to the new movie object
        movie.setId(nextId);
        movie.setTitle(movieRequest.title());
        movie.setGenre(movieRequest.genre());
        movie.setRating(movieRequest.rating());
        movie.setDescription(movieRequest.description());
        movie.setPosterUrl(movieRequest.posterUrl());
        movie.setDirector(movieRequest.director());
        movie.setDirectorImageUrl(movieRequest.directorImageUrl());
        movie.setProducer(movieRequest.producer());
        movie.setProducerImageUrl(movieRequest.producerImageUrl());
        movie.setMovieCast(movieRequest.movieCast());
        movie.setMovieCastImageUrls(movieRequest.movieCastImageUrls());
        movie.setReviews(movieRequest.reviews());
        movie.setStatus(movieRequest.status());

        // Check if any required fields are null
        if (movie.getTitle() == null
                || movie.getGenre() == null
                || movie.getRating() == null
                || movie.getDescription() == null
                || movie.getPosterUrl() == null
                || movie.getDirector() == null
                || movie.getProducer() == null
                || movie.getStatus() == null) {
            throw new IllegalArgumentException("All required fields must be filled.");
        }

        // Check if the movie already exists in the database
        if (movieRepository.existsByTitleAndDescription(movie.getTitle(), movie.getDescription())) {
            throw new IllegalArgumentException("A movie with that title and description already exists.");
        }

        return movieRepository.save(movie);
    }
}