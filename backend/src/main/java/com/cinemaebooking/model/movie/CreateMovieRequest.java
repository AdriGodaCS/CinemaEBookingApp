package com.cinemaebooking.model.movie;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateMovieRequest(
    String title,
    String genre,
    String rating,
    String description,
    String posterUrl,
    String director,
    String directorImageUrl,
    String producer,
    String producerImageUrl,
    List<String> movieCast,
    List<String> movieCastImageUrls,
    List<String> reviews,
    String status
) {
}
