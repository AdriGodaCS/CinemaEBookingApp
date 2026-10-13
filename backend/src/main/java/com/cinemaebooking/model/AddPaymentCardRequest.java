package com.cinemaebooking.model;

public record AddPaymentCardRequest(
        String cardNumber,
        Integer expirationMonth,
        Integer expirationYear,
        Address billingAddress
) {}
