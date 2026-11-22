package com.cinemaebooking.model.booking;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

@Document(collection = "bookings")
public class Booking {

    @Id
    private Integer id;

    @Field("booking_number")
    private String bookingNumber;

    @Field("customer_id")
    private Integer customerId;

    @Field("show_id")
    private Integer showId;

    @Field("movie_id")
    private Integer movieId;

    @Field("showroom_id")
    private Integer showroomId;

    @Field("show_date")
    private String showDate;

    @Field("show_time")
    private String showTime;

    private List<Map<String, Object>> tickets;

    private Number subtotal;

    @Field("promotion_id")
    private Integer promotionId;

    private Number discount;
    private Number total;

    private Map<String, Object> payment;

    private String status;

    @Field("created_at")
    private String createdAt;

    public Booking() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBookingNumber() {
        return bookingNumber;
    }

    public void setBookingNumber(String bookingNumber) {
        this.bookingNumber = bookingNumber;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getShowId() {
        return showId;
    }

    public void setShowId(Integer showId) {
        this.showId = showId;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public Integer getShowroomId() {
        return showroomId;
    }

    public void setShowroomId(Integer showroomId) {
        this.showroomId = showroomId;
    }

    public String getShowDate() {
        return showDate;
    }

    public void setShowDate(String showDate) {
        this.showDate = showDate;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
    }

    public List<Map<String, Object>> getTickets() {
        return tickets;
    }

    public void setTickets(List<Map<String, Object>> tickets) {
        this.tickets = tickets;
    }

    public Number getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Number subtotal) {
        this.subtotal = subtotal;
    }

    public Integer getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(Integer promotionId) {
        this.promotionId = promotionId;
    }

    public Number getDiscount() {
        return discount;
    }

    public void setDiscount(Number discount) {
        this.discount = discount;
    }

    public Number getTotal() {
        return total;
    }

    public void setTotal(Number total) {
        this.total = total;
    }

    public Map<String, Object> getPayment() {
        return payment;
    }

    public void setPayment(Map<String, Object> payment) {
        this.payment = payment;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}