package com.cinemaebooking.controller;

import com.cinemaebooking.model.seatlock.*;
import com.cinemaebooking.service.SeatLockService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/seatlocks")
@CrossOrigin(origins = "*")
public class SeatLockController {

    private final SeatLockService seatLockService;

    public SeatLockController(SeatLockService seatLockService) {
        this.seatLockService = seatLockService;
    }

    /****** GET ******/

    // Get all seat locks for a specific showId
    @GetMapping("/show/{showId}")
    public List<SeatLock> getSeatLocksByShowId(@PathVariable Integer showId) {
        return seatLockService.getByShowId(showId);
    }

    /****** POST ******/

    // Create a new seat lock for a specific showId
    @PostMapping("/show/{showId}")
    public ResponseEntity<?> createSeatLock(
        @PathVariable Integer showId,
        @RequestBody CreateSeatLockRequest seatLockRequest
    ) {
        try {
            SeatLock createdSeatLock = seatLockService.createSeatLock(seatLockRequest);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdSeatLock);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        java.util.Map.of(
                            "message", e.getMessage()
                        )
                    );
        }
    }

    /****** DELETE ******/

    // Delete a seat lock for a specific showId
    @DeleteMapping("/{seatLockId}")
    public ResponseEntity<Void> deleteSeatLock(
        @PathVariable String seatLockId,
        @RequestBody DeleteSeatLockRequest request
    ) {
        try {
            SeatLock seatLock = seatLockService.getById(seatLockId);
            seatLockService.deleteSeatLock(seatLock);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }
}