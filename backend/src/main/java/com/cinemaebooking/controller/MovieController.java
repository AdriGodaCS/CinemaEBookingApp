package com.cinemaebooking.controller;

import com.cinemaebooking.model.movie.CreateMovieRequest;
import com.cinemaebooking.model.movie.Movie;
import com.cinemaebooking.service.MovieService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /****** GET ******/

    // Get every movie
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // Get movie by ID
    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Integer id) {
        return movieService.getMovieById(id);
    }

    // Search movies by title
    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String title) {
        return movieService.findByTitleContainingIgnoreCase(title);
    }

    // Get a movie by exact title
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


    /****** POST ******/

    @PostMapping
    public ResponseEntity<?> addMovie(
        @RequestBody CreateMovieRequest movieRequest
    ) {
        try {
            Movie createdMovie = movieService.createMovie(movieRequest);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdMovie);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        java.util.Map.of(
                            "message",
                            e.getMessage()));
        }
    }

    /****** PUT ******/

    /****** DELETE ******/
}