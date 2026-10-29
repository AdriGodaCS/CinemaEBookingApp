package com.cinemaebooking.model.user.paymentcard;

import com.cinemaebooking.model.user.Address;

public record PaymentCardResponse(
        String cardId,
        Integer expirationMonth,
        Integer expirationYear,
        Address billingAddress
) {}