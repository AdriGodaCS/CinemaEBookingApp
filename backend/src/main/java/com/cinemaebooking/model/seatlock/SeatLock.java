package com.cinemaebooking.model.seatlock;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "seatLocks")
public class SeatLock {
    @Id 
    private String id;

    @Field("show_id")
    private Integer showId;

    @Field("seat_id")
    private String seatId;

    @Field("customer_id")
    private Integer customerId;

    private String status;

    @Field("locked_at")
    private String lockedAt;

    @Field("expires_at")
    private String expiresAt;

    // Getters and setters

    // Getter and Setter for id
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // Getter and Setter for showId
    public Integer getShowId() {
        return showId;
    }

    public void setShowId(Integer showId) {
        this.showId = showId;
    }

    // Getter and Setter for seatId
    public String getSeatId() {
        return seatId;
    }

    public void setSeatId(String seatId) {
        this.seatId = seatId;
    }

    // Getter and Setter for customerId
    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    // Getter and Setter for status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and Setter for lockedAt
    public String getLockedAt() {
        return lockedAt;
    }

    public void setLockedAt(String lockedAt) {
        this.lockedAt = lockedAt;
    }

    // Getter and Setter for expiresAt
    public String getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }
}