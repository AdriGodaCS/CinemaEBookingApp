
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

    // POST /bookings
    @PostMapping
    public ResponseEntity<?> addBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login required."));
        }

        User user = userRepository
                .findByEmailIgnoreCase(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found."));
        }

        // Associate the booking with the logged-in user
        booking.setCustomerId(user.getId());

        Booking savedBooking = bookingService.addBooking(booking);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedBooking);
    }

    // GET /bookings/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUserID(
            @PathVariable Integer userId,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login required."));
        }

        User user = userRepository
                .findByEmailIgnoreCase(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found."));
        }

        if (!user.getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Access denied."));
        }

        List<Booking> bookings =
                bookingService.getBookingsByUserID(userId);

        return ResponseEntity.ok(bookings);
    }
}
