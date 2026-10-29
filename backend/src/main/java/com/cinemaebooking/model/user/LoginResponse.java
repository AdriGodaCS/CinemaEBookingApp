package com.cinemaebooking.model.user;

public record LoginResponse(
    String token,
    String tokenType,
    LoggedInUserData user
) {
    
}
