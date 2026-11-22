package com.cinemaebooking.service;

import com.cinemaebooking.model.booking.Booking;
import com.cinemaebooking.model.booking.CreateBookingRequest;
import com.cinemaebooking.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getByUserId(Integer userId) {
        return bookingRepository.findByCustomerId(userId);
    }

    public Booking createBooking(CreateBookingRequest request) {
        Booking booking = new Booking.Builder()
                .bookingNumber(request.bookingNumber())
                .customerId(request.customerId())
                .showId(request.showId())
                .movieId(request.movieId())
                .showroomId(request.showroomId())
                .showDate(request.showDate())
                .showTime(request.showTime())
                .tickets(request.tickets())
                .subtotal(request.subtotal())
                .promotionId(request.promotionId())
                .discount(request.discount())
                .total(request.total())
                .payment(request.payment())
                .status(request.status())
                .createdAt(request.createdAt())
                .build();

        return bookingRepository.save(booking);
    }
}
