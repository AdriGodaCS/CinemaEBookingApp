package com.cinemaebooking.repository;

import com.cinemaebooking.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReadPreference;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository 
public interface UserRepository extends MongoRepository<User, Integer> {

//    List<User> findAllUsers();

    User findByEmail(String email);

    User findByEmailAndPasswordHash(String email, String passwordHash);

    Boolean existsByEmail(String email);
    
}
