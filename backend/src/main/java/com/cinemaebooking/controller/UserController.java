package com.cinemaebooking.controller;

import com.cinemaebooking.backend.BackendApplication;
import com.cinemaebooking.model.movie.Movie;
import com.cinemaebooking.model.user.CreateUserRequest;
import com.cinemaebooking.model.user.DeleteUserRequest;
import com.cinemaebooking.model.user.LoggedInUserData;
import com.cinemaebooking.model.user.LoginRequest;
import com.cinemaebooking.model.user.LoginResponse;
import com.cinemaebooking.model.user.UpdatePreferencesRequest;
import com.cinemaebooking.model.user.UpdateProfileRequest;
import com.cinemaebooking.model.user.User;
import com.cinemaebooking.model.user.password.ChangePasswordRequest;
import com.cinemaebooking.model.user.password.ForgotPasswordRequest;
import com.cinemaebooking.model.user.password.ResetPasswordRequest;
import com.cinemaebooking.model.user.paymentcard.AddPaymentCardRequest;
import com.cinemaebooking.service.UserService;
import com.cinemaebooking.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final BackendApplication backendApplication;
    private final UserService userService;
    private final EmailService emailService;

    public UserController(UserService userService, EmailService emailService, BackendApplication backendApplication) {
        this.userService = userService;
        this.emailService = emailService;
        this.backendApplication = backendApplication;
    }   


        /****** GET ******/


        @GetMapping("/{id}/checkResetPasswordToken")
        public ResponseEntity<Boolean> checkResetPasswordToken(
                        @PathVariable Integer id,
                        @RequestParam String token) {
        
                boolean valid = userService.checkResetPasswordToken(
                                id,
                                token);
        
                return ResponseEntity.ok(valid);
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

        @GetMapping("/{id}/favorites")
        public List<Movie> getFavorites(
                        @PathVariable Integer id) {
                return userService.getFavoriteMovies(id);
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
        

        /****** POST ******/


        // Create a user -- req: name, email, phone, pswd | opt: card, homeAddress
        @PostMapping
        public ResponseEntity<?> createUser(
                @RequestBody CreateUserRequest user) {
                try {
                
                        User createdUser = userService.createUser(user);
                        String verificationToken = UUID.randomUUID().toString();
                        createdUser.setVerificationToken(
                                        verificationToken);
        
                        userService.saveUser(createdUser);
                        emailService.sendVerificationEmail(
                                        createdUser.getEmail(),
                                        createdUser.getId(),
                                        verificationToken);
                                        
                        return ResponseEntity
                                        .status(HttpStatus.CREATED)
                                        .body(createdUser);
                } catch (IllegalArgumentException e) {
        
                        return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(
                                        java.util.Map.of(
                                                "message",
                                                e.getMessage()));
                }
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<Void> forgotPassword(
                        @RequestBody ForgotPasswordRequest request) {

                userService.sendPasswordResetEmail(
                                request.email());

                return ResponseEntity.ok().build();
        }

        // Login the user
        @PostMapping("/login")
        public ResponseEntity<?> loginUser(
                        @RequestBody LoginRequest loginRequest) {

                try {

                        LoginResponse response = userService.loginUser(
                                        loginRequest);

                        return ResponseEntity.ok(
                                        response);

                } catch (org.springframework.security.authentication.BadCredentialsException e) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body(
                                                        java.util.Map.of(
                                                                        "message",
                                                                        "Incorrect email or password."));

                } catch (IllegalStateException e) {

                        return ResponseEntity
                                        .status(HttpStatus.FORBIDDEN)
                                        .body(
                                                        java.util.Map.of(
                                                                        "message",
                                                                        e.getMessage()));
                }
        }

        @PostMapping("/{id}/cards")
        public ResponseEntity<Void> addCard(
                @PathVariable Integer id,
                @RequestBody AddPaymentCardRequest request,
                Authentication authentication
        ) {
                if (id != getCurrentUser(authentication).getBody().id()) {
                throw new IllegalArgumentException("User may mot edit a profile that is not theirs");
                }


                userService.addPaymentCard(
                        id,
                        request);

                return ResponseEntity.ok().build();

        }

        @PostMapping("/{userId}/favorites/{movieId}")
        public ResponseEntity<Void> addFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId,
            Authentication authentication
        ) {
        if (userId != getCurrentUser(authentication).getBody().id()) {
            throw new IllegalArgumentException("User may mot edit a profile that is not theirs");
        }

        userService.addFavorite(
                userId,
                movieId);


                return ResponseEntity.ok().build();
        }

        
        /****** PUT ******/


        @PutMapping("/reset-password")
        public ResponseEntity<Void> resetPassword(
                        @RequestBody ResetPasswordRequest request) {
        
                userService.resetPassword(
                                request);
        
                return ResponseEntity.ok().build();
        }

        @PutMapping("/{id}/profile")
        public User updateProfile(
                        @PathVariable Integer id,
                        @RequestBody UpdateProfileRequest request,
                        Authentication authentication) {
                if (id != getCurrentUser(authentication).getBody().id()) {
                        throw new IllegalArgumentException("User may mot edit a profile that is not theirs");
                }
                User user = userService.getStoredUserById(id);
                emailService.sendEmailForUpdataProfile(user.getEmail());
                return userService.updateProfile(
                                id,
                                request);
        }

        @PutMapping("/{id}/preferences")
        public User updatePreferences(
                        @PathVariable Integer id,
                        @RequestBody UpdatePreferencesRequest request,
                        Authentication authentication) {

                if (id != getCurrentUser(authentication)
                                .getBody()
                                .id()) {

                        throw new IllegalArgumentException(
                                        "User may not edit preferences that are not theirs");
                }

                return userService.updatePreferences(
                                id,
                                request.recievePromotions());
        }

        @PutMapping("/{id}/password")
        public ResponseEntity<Void> changePassword(
                @PathVariable Integer id,
                @RequestBody ChangePasswordRequest request,
                Authentication authentication
        ) {
        if (id != getCurrentUser(authentication).getBody().id()) {
            throw new IllegalArgumentException("User may mot edit a profile that is not theirs");
        }
        User user = userService.getStoredUserById(id);
                
        userService.changePassword(id, request);
        emailService.sendEmailForUpdataProfile(user.getEmail());

                return ResponseEntity.ok().build();
        }

        
        /****** DELETE ******/
        

        @DeleteMapping("/{id}/delete")
        public ResponseEntity<Void> deleteUser(
                @PathVariable Integer id,
                @RequestBody DeleteUserRequest request,
                Authentication authentication
        ) {
                // Check id sent in request
                if (request.id() != getCurrentUser(authentication).getBody().id()) {
                throw new IllegalArgumentException("User may mot delete a profile that is not theirs");
                }
                // check id from url
                if (id != getCurrentUser(authentication).getBody().id()) {
                throw new IllegalArgumentException("User may mot delete a profile that is not theirs");
                }
                User user = userService.getUserById(request.id());
                userService.deleteUser(user);
        
                return ResponseEntity.ok().build();
        }

        @DeleteMapping("/{id}/cards/{cardId}")
        public ResponseEntity<Void> removeCard(
                @PathVariable Integer id,
                @PathVariable String cardId,
                Authentication authentication
                ) {
                if (id != getCurrentUser(authentication).getBody().id()) {
                throw new IllegalArgumentException("User may mot edit a profile that is not theirs");
                }

                userService.removePaymentCard(
                                id,
                                cardId);

                return ResponseEntity.ok().build();
        }

        @DeleteMapping("/{userId}/favorites/{movieId}")
        public ResponseEntity<Void> removeFavorite(
                @PathVariable Integer userId,
                @PathVariable Integer movieId,
                Authentication authentication
                ) {
                if (userId != getCurrentUser(authentication).getBody().id()) {
                throw new IllegalArgumentException("User may mot edit a profile that is not theirs");
                }

                userService.removeFavorite(
                        userId,
                        movieId);

                return ResponseEntity.noContent().build();
        }
}
