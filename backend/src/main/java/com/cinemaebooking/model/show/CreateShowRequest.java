package com.cinemaebooking.model.show;

import jakarta.validation.constraints.NotBlank;

public record CreateShowRequest(

    @NotBlank 
    Integer movieId,

    @NotBlank 
    Integer showroomId,

    @NotBlank 
    String showDate,

    @NotBlank 
    String showTime,

    Integer durationMinutes,

    @NotBlank 
    String status
) {
}