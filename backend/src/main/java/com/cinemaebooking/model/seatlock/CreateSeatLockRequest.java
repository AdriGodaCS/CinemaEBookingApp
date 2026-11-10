package com.cinemaebooking.model.seatlock;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateSeatLockRequest(

    @NotNull
    Integer showId,

    @NotNull
    String seatId,

    @NotNull
    Integer customerId,

    @NotBlank
    String status,

    @NotBlank
    String lockedAt,

    @NotBlank
    String expiresAt
) {
}