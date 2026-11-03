package com.cinemaebooking.service;

import com.cinemaebooking.model.showroom.Showroom;
import com.cinemaebooking.repository.ShowroomRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShowroomService {

    private final ShowroomRepository showroomRepository;

    public ShowroomService(ShowroomRepository showroomRepository) {
        this.showroomRepository = showroomRepository;
    }

    // Get all showrooms
    public List<Showroom> getAllShowrooms() {
        return showroomRepository.findAll();
    }

    // Get a showroom by id
    public Optional<Showroom> getShowroomById(Integer id) {
        return showroomRepository.findById(id);
    }

    // Get a showroom by name
    public Optional<Showroom> getShowroomByName(String name) {
        return showroomRepository.findByName(name);
    }

    // Get showrooms by seat count
    public List<Showroom> getShowroomsBySeatCount(Integer seatCount) {
        return showroomRepository.findBySeatCount(seatCount);
    }
}