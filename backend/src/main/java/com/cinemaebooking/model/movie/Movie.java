package com.cinemaebooking.model.movie;

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

    public Movie() {

    }


     // Private constructor for Builder
     private Movie(Builder builder) {
        this.id = builder.id;
        this.title = builder.title;
        this.genre = builder.genre;
        this.rating = builder.rating;
        this.description = builder.description;
        this.posterUrl = builder.posterUrl;
        this.trailerUrl = builder.trailerUrl;
        this.director = builder.director;
        this.directorImageUrl = builder.directorImageUrl;
        this.producer = builder.producer;
        this.producerImageUrl = builder.producerImageUrl;
        this.movieCast = builder.movieCast;
        this.movieCastImageUrls = builder.movieCastImageUrls;
        this.reviews = builder.reviews;
        this.status = builder.status;
    }

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

    // Builder Class
    public static class Builder {
        private Integer id;
        private String title;
        private String genre;
        private String rating;
        private String description;
        private String posterUrl;
        private String trailerUrl;
        private String director;
        private String directorImageUrl;
        private String producer;
        private String producerImageUrl;
        private List<String> movieCast;
        private List<String> movieCastImageUrls;
        private List<String> reviews;
        private String status;

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder genre(String genre) {
            this.genre = genre;
            return this;
        }

        public Builder rating(String rating) {
            this.rating = rating;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder posterUrl(String posterUrl) {
            this.posterUrl = posterUrl;
            return this;
        }

        public Builder trailerUrl(String trailerUrl) {
            this.trailerUrl = trailerUrl;
            return this;
        }

        public Builder director(String director) {
            this.director = director;
            return this;
        }

        public Builder directorImageUrl(String directorImageUrl) {
            this.directorImageUrl = directorImageUrl;
            return this;
        }

        public Builder producer(String producer) {
            this.producer = producer;
            return this;
        }

        public Builder producerImageUrl(String producerImageUrl) {
            this.producerImageUrl = producerImageUrl;
            return this;
        }

        public Builder movieCast(List<String> movieCast) {
            this.movieCast = movieCast;
            return this;
        }

        public Builder movieCastImageUrls(List<String> movieCastImageUrls) {
            this.movieCastImageUrls = movieCastImageUrls;
            return this;
        }

        public Builder reviews(List<String> reviews) {
            this.reviews = reviews;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Movie build() {
            return new Movie(this);
        }
    }
}