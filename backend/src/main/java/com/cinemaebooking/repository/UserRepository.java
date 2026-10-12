package com.cinemaebooking.repository;

import com.cinemaebooking.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, Integer> {

    List<User> findAllUsers();

    User findByEmail(String email);

    User findByEmailAndPasswordHash(String email, String passwordHash);

    Boolean existsByEmail(String email);
    
}
