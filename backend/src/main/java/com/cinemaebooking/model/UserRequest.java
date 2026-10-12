package com.cinemaebooking.model;

public record UserRequest(
    String email,
    String password, 
    String firstName, 
    String lastName,
    String phone
) {
}
