package com.cinemaebooking.repository;

import com.cinemaebooking.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

// Repository for storing and retrieving movie documents
public interface MovieRepository extends MongoRepository<Movie, Integer> {

    // Find a movie by its title
    Movie findByTitle(String title);

    // Find movies by genre
    List<Movie> findByGenre(String genre);

    // Find movies by status
    List<Movie> findByStatus(String status);
}