package com.cinemaebooking.repository;

import com.cinemaebooking.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MovieRepository extends MongoRepository<Movie, Integer> {

    Movie findByTitle(String title);

    List<Movie> findByGenre(String genre);

    List<Movie> findByStatus(String status);
}