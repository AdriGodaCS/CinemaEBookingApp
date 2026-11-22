package com.cinemaebooking.model.promotion;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "promotions")
public class Promotion {
    @Id
    private Integer id;

    private String code;

    private String description;

    @Field("discount_type")
    private String discountType;

    @Field("discount_value")
    private Integer discountValue;

    @Field("start_date")
    private String startDate;

    @Field("end_date")
    private String endDate;

    private Boolean active;
    

    // Getters and Setters

    // id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // code
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // discountType
    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    // discountValue
    public Integer getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(Integer discountValue) {
        this.discountValue = discountValue;
    }

    // startDate
    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    // endDate
    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    // active
    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}