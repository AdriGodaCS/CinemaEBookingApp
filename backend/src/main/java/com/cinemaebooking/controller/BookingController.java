package com.cinemaebooking.controller;

import com.cinemaebooking.model.booking.Booking;
import com.cinemaebooking.model.user.User;
import com.cinemaebooking.repository.UserRepository;
import com.cinemaebooking.service.BookingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(
            BookingService bookingService,
            UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Customer account not found."));
        }

        List<Booking> bookings =
                bookingService.getOrderHistory(user.getId());

        return ResponseEntity.ok(bookings);
    }
}