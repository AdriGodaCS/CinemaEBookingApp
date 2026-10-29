package com.cinemaebooking.model.user.password;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {}