package com.cinemaebooking.repository;

import com.cinemaebooking.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository 
public interface MovieRepository extends MongoRepository<Movie, Integer> {

    Movie findByTitle(String title);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByGenre(String genre);

    List<Movie> findByStatus(String status);
}