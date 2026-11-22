package com.cinemaebooking.model.booking;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.util.List;

@Document(collection = "bookings")
public class Booking {
    @Id @JsonProperty("_id") private Integer id;
    @Field("booking_number") private String bookingNumber;
    @Field("customer_id") private Integer customerId;
    @Field("show_id") private Integer showId;
    @Field("movie_id") private Integer movieId;
    @Field("showroom_id") private Integer showroomId;
    @Field("show_date") private String showDate;
    @Field("show_time") private String showTime;
    private List<Ticket> tickets;
    private BigDecimal subtotal;
    @Field("promotion_id") private Integer promotionId;
    private BigDecimal discount;
    private BigDecimal total;
    private Payment payment;
    private String status;
    @Field("created_at") private String createdAt;

    public Booking() { }

    private Booking(Builder builder) {
        this.id = builder.id;
        this.bookingNumber = builder.bookingNumber;
        this.customerId = builder.customerId;
        this.showId = builder.showId;
        this.movieId = builder.movieId;
        this.showroomId = builder.showroomId;
        this.showDate = builder.showDate;
        this.showTime = builder.showTime;
        this.tickets = builder.tickets;
        this.subtotal = builder.subtotal;
        this.promotionId = builder.promotionId;
        this.discount = builder.discount;
        this.total = builder.total;
        this.payment = builder.payment;
        this.status = builder.status;
        this.createdAt = builder.createdAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String value) { bookingNumber = value; }
    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer value) { customerId = value; }
    public Integer getShowId() { return showId; }
    public void setShowId(Integer value) { showId = value; }
    public Integer getMovieId() { return movieId; }
    public void setMovieId(Integer value) { movieId = value; }
    public Integer getShowroomId() { return showroomId; }
    public void setShowroomId(Integer value) { showroomId = value; }
    public String getShowDate() { return showDate; }
    public void setShowDate(String value) { showDate = value; }
    public String getShowTime() { return showTime; }
    public void setShowTime(String value) { showTime = value; }
    public List<Ticket> getTickets() { return tickets; }
    public void setTickets(List<Ticket> value) { tickets = value; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal value) { subtotal = value; }
    public Integer getPromotionId() { return promotionId; }
    public void setPromotionId(Integer value) { promotionId = value; }
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal value) { discount = value; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal value) { total = value; }
    public Payment getPayment() { return payment; }
    public void setPayment(Payment value) { payment = value; }
    public String getStatus() { return status; }
    public void setStatus(String value) { status = value; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String value) { createdAt = value; }

    public static class Builder {
        private Integer id; private String bookingNumber; private Integer customerId; private Integer showId;
        private Integer movieId; private Integer showroomId; private String showDate; private String showTime;
        private List<Ticket> tickets; private BigDecimal subtotal; private Integer promotionId;
        private BigDecimal discount; private BigDecimal total; private Payment payment; private String status; private String createdAt;
        
        public Builder id(Integer value) { id = value; return this; }
        public Builder bookingNumber(String value) { bookingNumber = value; return this; }
        public Builder customerId(Integer value) { customerId = value; return this; }
        public Builder showId(Integer value) { showId = value; return this; }
        public Builder movieId(Integer value) { movieId = value; return this; }
        public Builder showroomId(Integer value) { showroomId = value; return this; }
        public Builder showDate(String value) { showDate = value; return this; }
        public Builder showTime(String value) { showTime = value; return this; }
        public Builder tickets(List<Ticket> value) { tickets = value; return this; }
        public Builder subtotal(BigDecimal value) { subtotal = value; return this; }
        public Builder promotionId(Integer value) { promotionId = value; return this; }
        public Builder discount(BigDecimal value) { discount = value; return this; }
        public Builder total(BigDecimal value) { total = value; return this; }
        public Builder payment(Payment value) { payment = value; return this; }
        public Builder status(String value) { status = value; return this; }
        public Builder createdAt(String value) { createdAt = value; return this; }
        public Booking build() { return new Booking(this); }
    }
}
