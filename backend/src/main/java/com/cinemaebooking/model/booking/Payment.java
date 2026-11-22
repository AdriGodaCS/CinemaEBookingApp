package com.cinemaebooking.model.booking;

import org.springframework.data.mongodb.core.mapping.Field;

public class Payment {
    @Field("payment_reference") private String paymentReference;
    @Field("payment_status") private String paymentStatus;

    public Payment() { }

    public String getPaymentReference() { return paymentReference; }

    public void setPaymentReference(String value) { paymentReference = value; }

    public String getPaymentStatus() { return paymentStatus; }
    
    public void setPaymentStatus(String value) { paymentStatus = value; }
}
