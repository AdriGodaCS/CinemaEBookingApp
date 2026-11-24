package com.cinemaebooking.model.recommendation;

import org.springframework.data.mongodb.core.mapping.Field;

public class RecommendedMovie {

    @Field("movie_id")
    private Integer movieId;

    private String reason;

    public RecommendedMovie() {
    }

    // Getter and Setter for movieId
    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    // Getter and Setter for reason
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
