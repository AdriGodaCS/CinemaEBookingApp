package com.cinemaebooking.repository;

import com.cinemaebooking.model.booking.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, Integer> {

    List<Booking> findByCustomerId(Integer customerId);
}
