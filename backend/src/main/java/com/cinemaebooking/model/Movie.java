package com.cinemaebooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "movies")
public class Movie {

    @Id
    private Integer id;

    private String title;
    private String genre;
    private String rating;
    private String description;

    @Field("poster_url")
    private String posterUrl;

    @Field("trailer_url")
    private String trailerUrl;

    private String director;

    @Field("director_image_url")
    private String directorImageUrl;

    private String producer;

    @Field("producer_image_url")
    private String producerImageUrl;

    @Field("movie_cast")
    private List<String> movieCast;

    @Field("movie_cast_image_urls")
    private List<String> movieCastImageUrls;

    private List<String> reviews;

    private String status;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getDirectorImageUrl() {
        return directorImageUrl;
    }

    public void setDirectorImageUrl(String directorImageUrl) {
        this.directorImageUrl = directorImageUrl;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getProducerImageUrl() {
        return producerImageUrl;
    }

    public void setProducerImageUrl(String producerImageUrl) {
        this.producerImageUrl = producerImageUrl;
    }

    public List<String> getMovieCast() {
        return movieCast;
    }

    public void setMovieCast(List<String> movieCast) {
        this.movieCast = movieCast;
    }

    public List<String> getMovieCastImageUrls() {
        return movieCastImageUrls;
    }

    public void setMovieCastImageUrls(List<String> movieCastImageUrls) {
        this.movieCastImageUrls = movieCastImageUrls;
    }

    public List<String> getReviews() {
        return reviews;
    }

    public void setReviews(List<String> reviews) {
        this.reviews = reviews;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}