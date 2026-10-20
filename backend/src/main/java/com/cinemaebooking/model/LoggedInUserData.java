package com.cinemaebooking.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoggedInUserData(
    Integer id,

    @NotBlank 
    @Email
    String email,

    @NotBlank String firstName, 

    @NotBlank String lastName,

    String phone,
//    Address homAddress,
//    List<PaymentCard> paymentCards,
    String status,
    String role,
    Boolean recievePromotions,
    int[] favoriteMovieIds
) {

}
