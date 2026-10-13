package com.cinemaebooking.service;

import com.cinemaebooking.model.User;
import com.cinemaebooking.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service 
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmailAndPasswordHash(String email, String passwordHash) {
        return userRepository.findByEmailAndPasswordHash(email, passwordHash);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("A user with that email already exists");
        }

        user.setId(null);

        return userRepository.save(user);
    }

    public User editUser(User user) {
        return userRepository.save(user);
    }

}
