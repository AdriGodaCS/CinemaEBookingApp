package com.cinemaebooking.model.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateBookingRequest(
    @NotBlank String bookingNumber,
    @NotNull Integer customerId,
    @NotNull Integer showId,
    @NotNull Integer movieId,
    @NotNull Integer showroomId,
    @NotBlank String showDate,
    @NotBlank String showTime,
    @NotNull List<Ticket> tickets,
    @NotNull BigDecimal subtotal,
    Integer promotionId,
    @NotNull BigDecimal discount,
    @NotNull BigDecimal total,
    Payment payment,
    @NotBlank String status,
    @NotBlank String createdAt
) { }
