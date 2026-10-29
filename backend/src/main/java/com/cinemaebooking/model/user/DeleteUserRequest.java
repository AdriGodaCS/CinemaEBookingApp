package com.cinemaebooking.model.user;

import jakarta.validation.constraints.NotBlank;

public record DeleteUserRequest(
    @NotBlank 
    Integer id
) {
}
