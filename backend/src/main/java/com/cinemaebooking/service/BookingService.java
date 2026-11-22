package com.cinemaebooking.service;

import com.cinemaebooking.model.booking.Booking;
import com.cinemaebooking.repository.BookingRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getOrderHistory(Integer customerId) {
        return bookingRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}