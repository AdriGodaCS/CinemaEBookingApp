package com.cinemaebooking.repository;

import com.cinemaebooking.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, Integer> {

//    List<User> findAllUsers();

    Optional<User> findByEmailIgnoreCase(String email);

    User findByEmailAndPasswordHash(String email, String passwordHash);

    Boolean existsByEmailIgnoreCase(String email);
    
    User findByVerificationToken(String token);
}
