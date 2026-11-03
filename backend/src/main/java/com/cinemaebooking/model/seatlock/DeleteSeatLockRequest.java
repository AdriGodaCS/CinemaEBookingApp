package com.cinemaebooking.model.seatlock;

import jakarta.validation.constraints.NotBlank;

public record DeleteSeatLockRequest(
    @NotBlank 
    Integer seatLockId
) {
}
