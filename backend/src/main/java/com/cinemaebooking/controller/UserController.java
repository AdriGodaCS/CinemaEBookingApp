package com.cinemaebooking.controller;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.AddPaymentCardRequest;
import com.cinemaebooking.model.ChangePasswordRequest;
import com.cinemaebooking.model.CreateUserRequest;
import com.cinemaebooking.model.Movie;
import com.cinemaebooking.model.ResetPasswordRequest;
import com.cinemaebooking.model.UpdateProfileRequest;
import com.cinemaebooking.model.LoggedInUserData;
import com.cinemaebooking.model.LoginRequest;
import com.cinemaebooking.model.LoginResponse;
import com.cinemaebooking.service.UserService;
import com.cinemaebooking.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
            @RequestBody CreateUserRequest user) {
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

    @GetMapping("/{id}/checkResetPasswordToken")
    public ResponseEntity<Boolean> checkResetPasswordToken(
            @PathVariable Integer id,
            @RequestParam String token) {

        boolean valid = userService.checkResetPasswordToken(
                id,
                token);

        return ResponseEntity.ok(valid);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(
                request);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/passwordChangeRequest")
    public ResponseEntity<Void> requestPasswordChange(
            @PathVariable Integer id) {

        User user = userService.getUserById(id);

        String token = UUID.randomUUID().toString();

        user.setPasswordResetToken(token);

        userService.saveUser(user);

        emailService.sendEmailToChangePassword(
                user.getEmail(),
                user.getId(),
                token);

        return ResponseEntity.ok().build();
    }

    // Login the user
    @GetMapping("/login")
    public LoginResponse loginUser(LoginRequest loginRequest) {
        return userService.loginUser(loginRequest);
    }

    // Retrieve data from the logged in user
    @GetMapping("/me")
    public ResponseEntity<LoggedInUserData> getCurrentUser(
            Authentication authentication) {

        LoggedInUserData userData = userService.getLoggedInUserData(
                authentication.getName());

        return ResponseEntity.ok(userData);
    }

    @GetMapping("/{id}")
    public User getUser(
            @PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}/profile")
    public User updateProfile(
            @PathVariable Integer id,
            @RequestBody UpdateProfileRequest request) {
        User user = userService.getUserById(id);
        emailService.sendEmailForUpdataProfile(user.getEmail());
        return userService.updateProfile(
                id,
                request);
    }

    @PostMapping("/{id}/cards")
    public ResponseEntity<Void> addCard(
            @PathVariable Integer id,
            @RequestBody AddPaymentCardRequest request) {

        userService.addPaymentCard(
                id,
                request);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/cards/{cardId}")
    public ResponseEntity<Void> removeCard(
            @PathVariable Integer id,
            @PathVariable String cardId) {

        userService.removePaymentCard(
                id,
                cardId);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/favorites")
    public List<Movie> getFavorites(
            @PathVariable Integer id) {
        return userService.getFavoriteMovies(id);
    }

    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId) {
        userService.removeFavorite(
                userId,
                movieId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Void> addFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId) {
        userService.addFavorite(
                userId,
                movieId);

        return ResponseEntity.ok().build();
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
