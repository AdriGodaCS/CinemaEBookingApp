package com.cinemaebooking.model.promotion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreatePromotionRequest(

    @NotBlank
    String code,

    @NotBlank
    String description,

    @NotBlank
    String discountType,

    @NotNull
    Integer discountValue,

    @NotBlank
    String startDate,

    @NotBlank
    String endDate,

    @NotNull
    Boolean active
) {
}
