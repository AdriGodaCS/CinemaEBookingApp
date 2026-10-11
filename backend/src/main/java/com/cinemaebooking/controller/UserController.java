package com.cinemaebooking.controller;

import com.cinemaebooking.model.User;
import com.cinemaebooking.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController 
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create a user -- req: name, email, phone, pswd | opt: card, homeAddress

    // Retrieve a user using an email and passwordHash

    // Add payment card

    // edit user
    
}
