package com.cinemaebooking.model.movie;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateMovieRequest(

    @NotBlank
    String title,

    @NotBlank
    String genre,

    @NotBlank
    String rating,

    @NotBlank
    String description,

    @NotBlank
    String posterUrl,

    @NotBlank
    String director,

    String directorImageUrl,

    @NotBlank
    String producer,

    String producerImageUrl,

    @NotBlank
    List<String> movieCast,

    List<String> movieCastImageUrls,

    @NotBlank
    List<String> reviews,

    @NotBlank
    String status
) {
}
