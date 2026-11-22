package com.cinemaebooking.model.booking;

import org.springframework.data.mongodb.core.mapping.Field;
import java.math.BigDecimal;

public class Ticket {
    @Field("ticket_number") private String ticketNumber;
    @Field("seat_id") private String seatId;
    @Field("ticket_type") private String ticketType;
    private BigDecimal price;

    public Ticket() { }

    public String getTicketNumber() { return ticketNumber; }

    public void setTicketNumber(String value) { ticketNumber = value; }

    public String getSeatId() { return seatId; }

    public void setSeatId(String value) { seatId = value; }

    public String getTicketType() { return ticketType; }

    public void setTicketType(String value) { ticketType = value; }

    public BigDecimal getPrice() { return price; }
    
    public void setPrice(BigDecimal value) { price = value; }
}
