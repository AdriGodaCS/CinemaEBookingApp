package com.cinemaebooking.model;

public record PaymentCardResponse(
        String cardId,
        Integer expirationMonth,
        Integer expirationYear,
        Address billingAddress
) {}