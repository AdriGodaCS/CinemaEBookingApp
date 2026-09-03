package com.cinemaebooking.service;

import com.cinemaebooking.model.Movie;
import com.cinemaebooking.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Service layer for movie operations
@Service
public class MovieService {

    // Repository used to access movie data
    private final MovieRepository movieRepository;

    // Constructor for injecting the movie repository
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    // Retrieve all movies
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    // Retrieve a movie by title
    public Movie getMovieByTitle(String title) {
        return movieRepository.findByTitle(title);
    }

    // Retrieve movies by genre
    public List<Movie> getMoviesByGenre(String genre) {
        return movieRepository.findByGenre(genre);
    }

    // Retrieve movies by status
    public List<Movie> getMoviesByStatus(String status) {
        return movieRepository.findByStatus(status);
    }
}