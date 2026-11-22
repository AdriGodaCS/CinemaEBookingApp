package com.cinemaebooking.service;

import org.springframework.stereotype.Service;

import com.cinemaebooking.model.promotion.Promotion;
import com.cinemaebooking.model.promotion.CreatePromotionRequest;
import com.cinemaebooking.repository.PromotionRepository;

import java.util.List;
import java.util.Optional;

public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // Get all promotions
    public List<Promotion> getAll() {
        return promotionRepository.findAll();
    }

    // Get all promotions by active state
    public List<Promotion> getAllByActive(Boolean isActive) {
        return this.promotionRepository.findByActive(isActive);
    }

    // Get promotion by code
    public Promotion getByPromoCode(String promoCode) {
        return this.promotionRepository.findByCode(promoCode)
            .orElse(null);
    }

    // Add promotion
    public Promotion createPromotion(CreatePromotionRequest request) {
        Promotion promo = new Promotion();
        if (promotionRepository.existsByCode(request.code())) {
            throw new IllegalArgumentException("Cannot creat a promotion with an existing promo code");
        }

        Integer nextId = promotionRepository.findTopByOrderByIdDesc()
                .map(existingPromo -> existingPromo.getId() + 1)
                .orElse(1);

        promo.setId(nextId);
        promo.setCode(request.code());
        promo.setDescription(request.code());

        return promotionRepository.save(promo);
    }

    // Delete promotion

    // Send promotional email (get using id)
    
}
