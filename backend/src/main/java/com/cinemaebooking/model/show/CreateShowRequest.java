package com.cinemaebooking.model.show;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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

/*
_id: 1
movie_id: 1
showroom_id: 1
show_date: "2026-10-15"
show_time: "19:30"
duration_minutes: 120
status: "SCHEDULED"
 */