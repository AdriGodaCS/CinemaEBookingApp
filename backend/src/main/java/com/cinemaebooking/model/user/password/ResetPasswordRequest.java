package com.cinemaebooking.model.user.password;

public record ResetPasswordRequest(
        Integer userId,
        String token,
        String newPassword
) {}