package com.cinemaebooking.model;

import com.cinemaebooking.model.Address;
import com.cinemaebooking.model.PaymentCard;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @NotBlank 
    @Email
    String email,

    @NotBlank 
    @Size(min = 8)
    String password, 

    @NotBlank String firstName, 

    @NotBlank String lastName,

    String phone,
    Address homAddress,
    List<PaymentCard> paymentCards
) {
}
