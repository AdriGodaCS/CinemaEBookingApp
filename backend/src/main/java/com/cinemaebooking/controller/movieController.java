package com.cinemaebooking.controller;

import com.cinemaebooking.model.Movie;
import com.cinemaebooking.service.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST controller for movie-related requests
@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    // Service used to retrieve movie data
    private final MovieService movieService;

    // Constructor for injecting the movie service
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // Get every movie
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // Get a movie by title
    @GetMapping("/title/{title}")
    public Movie getMovieByTitle(@PathVariable String title) {
        return movieService.getMovieByTitle(title);
    }

    // Get movies by genre
    @GetMapping("/genre/{genre}")
    public List<Movie> getMoviesByGenre(@PathVariable String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    // Get movies by status
    @GetMapping("/status/{status}")
    public List<Movie> getMoviesByStatus(@PathVariable String status) {
        return movieService.getMoviesByStatus(status);
    }
}