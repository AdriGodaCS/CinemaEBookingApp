package com.cinemaebooking.repository;

import com.cinemaebooking.model.recommendation.Recommendation;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecommendationRepository
        extends MongoRepository<Recommendation, Integer> {

    Optional<Recommendation> findByCustomerId(Integer customerId);

    Optional<Recommendation> findTopByOrderByIdDesc();
}
