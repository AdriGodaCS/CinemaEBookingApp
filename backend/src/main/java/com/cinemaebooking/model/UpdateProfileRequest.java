package com.cinemaebooking.model;

import java.util.List;

public record UpdateProfileRequest(
    String firstName,
    String lastName,
    String phone,
    Address homeAddress,
    List<PaymentCard> paymentCards    
) {}
