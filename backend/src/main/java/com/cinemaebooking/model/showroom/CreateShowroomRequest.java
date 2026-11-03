package com.cinemaebooking.model.showroom;

import jakarta.validation.constraints.NotBlank;


public record CreateShowroomRequest(
    @NotBlank 
    String name,

    @NotBlank 
    Integer seatCount
) {
}
