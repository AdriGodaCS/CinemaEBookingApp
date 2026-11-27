package com.cinemaebooking.repository;

import com.cinemaebooking.model.booking.Booking;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository
        extends MongoRepository<Booking, Integer> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(
            Integer customerId);

        Optional<Booking> findTopByOrderByIdDesc();
}