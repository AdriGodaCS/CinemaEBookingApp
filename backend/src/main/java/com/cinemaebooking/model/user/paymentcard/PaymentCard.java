package com.cinemaebooking.model.user.paymentcard;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.cinemaebooking.model.user.Address;

@Document(collection = "PaymentCards")
public class PaymentCard {
    @Id 
    @Field("card_id")
    private String cardId;

    @Field("card_number_hash")
    private String cardNumberHash;

    @Field("expiration_month")
    private String expirationMonth;

    @Field("expiration_year")
    private String expirationYear;

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
    public String getExpirationMonth() {
        return expirationMonth;
    }

    public void setExpirationMonth(String expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    // Getter and Setter for expirationYear
    public String getExpirationYear() {
        return expirationYear;
    }

    public void setExpirationYear(String expirationYear) {
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
