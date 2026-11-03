package com.cinemaebooking.service;

import com.cinemaebooking.model.seatlock.*;
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

    public SeatLock getById(Integer id) {
        SeatLock seatLock = seatLockRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                    "SeatLock not found with id" + id));
        return seatLock;
    }

    public List<SeatLock> getByShowId(Integer showId) {
        return seatLockRepository.findByShowId(showId);
    }

    public SeatLock createSeatLock(CreateSeatLockRequest request) {
        SeatLock seatLock = new SeatLock();
        Integer nextId = seatLockRepository.findTopByOrderByIdDesc()
                .map(existingSeatLock -> existingSeatLock.getId() + 1)
                .orElse(1);

        seatLock.setId(nextId);
        seatLock.setShowId(request.showId());
        seatLock.setSeatId(request.seatId());
        seatLock.setCustomerId(request.customerId());
        seatLock.setStatus(request.status());
        seatLock.setLockedAt(request.lockedAt());
        seatLock.setExpiresAt(request.expiresAt());

        // Check for duplicates
        if (seatLockRepository.existsByShowIdAndSeatId()) {
            throw new IllegalArgumentException("Cannot select a seat that is already locked.");
        }

        return seatLockRepository.save(seatLock);
    }

    public void deleteSeatLock(SeatLock seatLock) {
        seatLockRepository.delete(seatLock);
    }
}
