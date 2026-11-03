package com.cinemaebooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cinemaebooking.model.showroom.Showroom;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShowroomRepository extends MongoRepository<Showroom, Integer> {

    // Find all showrooms
    List<Showroom> findAll();

    // Find a showroom by name
    Optional<Showroom> findByName(String name);

    // Find showrooms by the number of seats
    List<Showroom> findBySeatCount(Integer seatCount);
}