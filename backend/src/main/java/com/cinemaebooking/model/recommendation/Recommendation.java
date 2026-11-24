package com.cinemaebooking.model.recommendation;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "recommendations")
public class Recommendation {

    @Id
    private Integer id;

    @Field("customer_id")
    private Integer customerId;

    @Field("generated_at")
    private String generatedAt;

    private List<RecommendedMovie> recommendations;

    // Getters and setters

    // Getter and Setter for id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // Getter and Setter for customerId
    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    // Getter and Setter for generatedAt
    public String getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(String generatedAt) {
        this.generatedAt = generatedAt;
    }

    // Getter and Setter for recommendations
    public List<RecommendedMovie> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<RecommendedMovie> recommendations) {
        this.recommendations = recommendations;
    }

}
