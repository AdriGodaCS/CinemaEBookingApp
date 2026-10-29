package com.cinemaebooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cinemaebooking.model.movie.Movie;

import java.util.List;
import java.util.Optional;

@Repository 
public interface MovieRepository extends MongoRepository<Movie, Integer> {

    Movie findByTitle(String title);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByGenre(String genre);

    List<Movie> findByStatus(String status);

    Optional<Movie> findTopByOrderByIdDesc();

    Boolean existsByTitleAndDescription(String title, String description);
}