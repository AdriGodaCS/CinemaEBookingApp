package com.cinemaebooking.controller;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.CreateUserRequest;
import com.cinemaebooking.service.UserService;
import com.cinemaebooking.service.EmailService;

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
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
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

    // edit user
    @PutMapping
    public User editUser(User user) {
        return userService.editUser(user);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam("token") String token) {
        User user = userService.getByVerificationToken(token);
    
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification token.");
        }
    
        user.setStatus("ACTIVE");
        user.setVerificationToken(null); // Clear the token after verification
        userService.saveUser(user);
    
        return ResponseEntity
            .ok("Account verified successfully!");
    }
}
