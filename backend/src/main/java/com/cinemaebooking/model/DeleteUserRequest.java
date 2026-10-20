package com.cinemaebooking.model;

import jakarta.validation.constraints.NotBlank;

public record DeleteUserRequest(
    @NotBlank 
    Integer id
) {
}
