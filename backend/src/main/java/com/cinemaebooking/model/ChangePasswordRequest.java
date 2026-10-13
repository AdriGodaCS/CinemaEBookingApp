package com.cinemaebooking.model;

public record ChangePasswordRequest(
        String currentPassword,
        String newPassword
) {}