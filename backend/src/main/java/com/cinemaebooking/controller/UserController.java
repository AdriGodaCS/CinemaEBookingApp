package com.cinemaebooking.controller;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.CreateUserRequest;
import com.cinemaebooking.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController 
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create a user -- req: name, email, phone, pswd | opt: card, homeAddress
    @PostMapping
    public ResponseEntity<User> createUser(
        @RequestBody CreateUserRequest user
    ) {
        User createdUser = userService.createUser(user);

        // Generate a verification token
        String verificationToken = UUID.randomUUID().toString();
        createdUser.setVerificationToken(verificationToken);
            
        // Save the user with the token
        userService.saveUser(createdUser);
    
        // Send verification email
        emailService.sendVerificationEmail(createdUser.getEmail(), verificationToken);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(createdUser);
    }

    // Retrieve a user using an email and passwordHash
    public User getUserByEmailAndPassword(String email, String password) {
        return userService.getUserByEmailAndPassword(email, password);
    }

    // Add payment card

    // edit user
    @PutMapping
    public User editUser(User user) {
        return userService.editUser(user);
    }
}
