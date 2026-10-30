package com.cinemaebooking.model.show;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.classmate.AnnotationOverrides.StdImpl;

@Document(collection = "shows")
public class Show {
    
    @Id 
    private Integer id;

    @Field("movie_id")
    private Integer movieId;

    @Field("showroom_id")
    private Integer showroomId;

    @Field("show_date")
    private String showDate;

    @Field("show_time")
    private String showTime;

    @Field("duration_minutes")
    private Integer durationMinutes;

    private String status;

    // Getters and Setters

    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
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
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}