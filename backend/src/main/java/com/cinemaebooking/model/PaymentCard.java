package com.cinemaebooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "PaymentCards")
public class PaymentCard {
    @Id 
    @Field("card_id")
    private String cardId;

    @Field("card_number_hash")
    private String cardNumberHash;

    @Field("expiration_month")
    private Integer expirationMonth;

    @Field("expiration_year")
    private Integer expirationYear;

    @Field("billing_address")
    private Address billingAddress;

    // Getter and Setter for cardId
    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    // Getter and Setter for cardNumberHash
    public String getCardNumberHash() {
        return cardNumberHash;
    }

    public void setCardNumberHash(String cardNumberHash) {
        this.cardNumberHash = cardNumberHash;
    }

    // Getter and Setter for expirationMonth
    public Integer getExpirationMonth() {
        return expirationMonth;
    }

    public void setExpirationMonth(Integer expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    // Getter and Setter for expirationYear
    public Integer getExpirationYear() {
        return expirationYear;
    }

    public void setExpirationYear(Integer expirationYear) {
        this.expirationYear = expirationYear;
    }

    // Getter and Setter for billingAddress
    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(Address billingAddress) {
        this.billingAddress = billingAddress;
    }
    
}
