package com.cinemaebooking.model;

import com.cinemaebooking.model.Address;
import com.cinemaebooking.model.PaymentCard;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoggedInUserData(
    @NotBlank 
    @Email
    String email,

    @NotBlank String firstName, 

    @NotBlank String lastName,

    String phone,
    Address homAddress,
    List<PaymentCard> paymentCards,
    String status,
    String role,
    Boolean recievePromotions,
    int[] favoriteMovieIds
) {
}
