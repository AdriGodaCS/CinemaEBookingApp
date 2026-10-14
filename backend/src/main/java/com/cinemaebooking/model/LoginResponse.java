package com.cinemaebooking.model;

public record LoginResponse(
    String token,
    String tokenType,
    LoggedInUserData user
) {
    
}
