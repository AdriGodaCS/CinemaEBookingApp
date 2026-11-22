package com.cinemaebooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cinemaebooking.model.promotion.Promotion;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends MongoRepository<Promotion, Integer> {
    Optional<Promotion> findByCode(String code);

    List<Promotion> findByDiscountType(String discountType);

    List<Promotion> findByStartDate(String startDate);

    List<Promotion> findByEndDate(String endDate);

    List<Promotion> findByStartDateAndEndDate(String startDate, String endDate);

    List<Promotion> findByDiscountValue(Integer discountValue);

    List<Promotion> findByActive(Boolean active);

    Boolean existsByCode(String code);

    Optional<Promotion> findTopByOrderByIdDesc();
}
