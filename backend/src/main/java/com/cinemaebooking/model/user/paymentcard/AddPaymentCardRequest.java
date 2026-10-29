package com.cinemaebooking.model.user.paymentcard;

import com.cinemaebooking.model.user.Address;

public record AddPaymentCardRequest(
        String cardNumber,
        Integer expirationMonth,
        Integer expirationYear,
        Address billingAddress
) {}
