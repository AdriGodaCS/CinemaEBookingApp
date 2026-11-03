package com.cinemaebooking.service;

import com.cinemaebooking.model.seatlock.SeatLock;
import com.cinemaebooking.repository.SeatLockRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatLockService {

    private final SeatLockRepository seatLockRepository;

    public SeatLockService(SeatLockRepository seatLockRepository) {
        this.seatLockRepository = seatLockRepository;
    }

    public Optional<SeatLock> getById(Integer id) {
        return seatLockRepository.findById(id);
    }
}
