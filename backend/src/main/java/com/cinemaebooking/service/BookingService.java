
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

    // Add a booking
    public Booking addBooking(Booking booking) {
         Integer nextId = bookingRepository.findTopByOrderByIdDesc()
            .map(existing -> existing.getId() + 1)
            .orElse(1);

        booking.setId(nextId);

        return bookingRepository.insert(booking);
    }

    // Get bookings for a specific user
    public List<Booking> getBookingsByUserID(Integer userId) {
        return bookingRepository
                .findByCustomerIdOrderByCreatedAtDesc(userId);
    }

    // Existing order history method
    public List<Booking> getOrderHistory(Integer customerId) {
        return bookingRepository
                .findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}
