package com.cinemaebooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.cinemaebooking.model.seatlock.SeatLock;

import java.util.List;
import java.util.Optional;

@Repository 
public interface SeatLockRepository extends MongoRepository<SeatLock, Integer> {
    List<SeatLock> findAll();

    List<SeatLock> findByShowId(Integer showId);

    Optional<SeatLock> findByShowIdAndSeatId(Integer showId, Integer seatId);

    List<SeatLock> findByLockedAt(String lockedAt);

    List<SeatLock> findByExpiresAt(String expiresAt);
}
