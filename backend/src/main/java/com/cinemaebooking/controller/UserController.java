package com.cinemaebooking.controller;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.UserRequest;
import com.cinemaebooking.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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
        @RequestBody UserRequest user
    ) {
        User createdUser = userService.createUser(user);
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
