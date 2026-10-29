package com.cinemaebooking.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReadPreference;
import org.springframework.stereotype.Repository;

import com.cinemaebooking.model.user.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, Integer> {

    // List<User> findAllUsers();

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findTopByOrderByIdDesc();

    User findByEmailAndPasswordHash(String email, String passwordHash);

    Boolean existsByEmailIgnoreCase(String email);

    User findByVerificationToken(String token);

    Optional<User> findByPasswordResetToken(String passwordResetToken);
}
