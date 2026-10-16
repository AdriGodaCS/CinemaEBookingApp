package com.cinemaebooking.model;

public record ResetPasswordRequest(
        Integer userId,
        String token,
        String newPassword
) {}