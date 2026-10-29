package com.cinemaebooking.model.user;

import java.util.List;

import com.cinemaebooking.model.user.paymentcard.PaymentCard;

public record UpdateProfileRequest(
    String firstName,
    String lastName,
    String phone,
    Address homeAddress,
    List<PaymentCard> paymentCards    
) {}
