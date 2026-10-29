package com.cinemaebooking.model.user;

import java.util.List;

import com.cinemaebooking.model.user.Address;
import com.cinemaebooking.model.user.paymentcard.AddPaymentCardRequest;

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
    Address homeAddress,
    Boolean recievePromotions,
    List<AddPaymentCardRequest> paymentCards
) {
}
