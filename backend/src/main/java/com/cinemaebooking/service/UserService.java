package com.cinemaebooking.service;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.AddPaymentCardRequest;
import com.cinemaebooking.model.ChangePasswordRequest;
import com.cinemaebooking.model.CreateUserRequest;
import com.cinemaebooking.model.Movie;
import com.cinemaebooking.model.PaymentCard;
import com.cinemaebooking.model.ResetPasswordRequest;
import com.cinemaebooking.model.LoggedInUserData;
import com.cinemaebooking.model.LoginRequest;
import com.cinemaebooking.model.LoginResponse;
import com.cinemaebooking.repository.UserRepository;
import com.cinemaebooking.Security.SecurityConfig;
import com.cinemaebooking.Security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cinemaebooking.model.UpdateProfileRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final MovieService movieService;

    private final JwtUtil jwtUtil;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            MovieService movieService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.movieService = movieService;
        this.jwtUtil = jwtUtil;
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with id: " + id));
    }

    public User updateProfile(
            Integer id,
            UpdateProfileRequest request) {
        User user = getUserById(id);

        if (request.paymentCards() != null
                && request.paymentCards().size() > 3) {
            throw new IllegalArgumentException(
                    "Users may have a maximum of 3 payment cards.");
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setPhone(request.phone());
        user.setHomeAddress(request.homeAddress());
        user.setPaymentCards(request.paymentCards());
        user.setRecievePromotions(
                request.recievePromotions());

        return userRepository.save(user);
    }

    public void resetPassword(
            ResetPasswordRequest request) {

        User user = getUserById(
                request.userId());

        if (!request.token().equals(
                user.getPasswordResetToken())) {

            throw new RuntimeException(
                    "Invalid password reset token");
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.newPassword()));

        user.setPasswordResetToken(
                null);

        userRepository.save(user);
    }

    public void changePassword(
            Integer userId,
            ChangePasswordRequest request) {
        User user = getUserById(userId);

        boolean matches = passwordEncoder.matches(
                request.currentPassword(),
                user.getPasswordHash());

        if (!matches) {
            throw new IllegalArgumentException(
                    "Current password is incorrect.");
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.newPassword()));

        user.setPasswordResetToken(null);

        userRepository.save(user);
    }

    public List<Movie> getFavoriteMovies(
            Integer userId) {
        User user = getUserById(userId);

        if (user.getFavoriteMovieIds() == null) {
            return Collections.emptyList();
        }

        return Arrays.stream(
                user.getFavoriteMovieIds())
                .mapToObj(movieService::getMovieById)
                .toList();
    }

    public void removeFavorite(
            Integer userId,
            Integer movieId) {
        User user = getUserById(userId);

        if (user.getFavoriteMovieIds() == null) {
            return;
        }

        int[] updatedFavorites = Arrays.stream(user.getFavoriteMovieIds())
                .filter(id -> id != movieId)
                .toArray();

        user.setFavoriteMovieIds(updatedFavorites);

        userRepository.save(user);
    }

    public LoginResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException(
                        "Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPasswordHash());

        if (!passwordMatches) {
            throw new BadCredentialsException(
                    "Invalid email or password");
        }

        if (user.getStatus().equals("INACTIVE")) {
            throw new IllegalStateException(
                    "Account must be verified to log in.");
        }


        if (user.getStatus().equals("SUSPENDED")) {
            throw new IllegalStateException(
                "Account must be verified to log in."
            );
        }
        
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        LoggedInUserData userData = new LoggedInUserData(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getStatus(),
                user.getRole(),
                user.getRecievePromotions(),
                user.getFavoriteMovieIds());

        return new LoginResponse(
                token,
                "Bearer",
                userData);
    }

    public LoggedInUserData getLoggedInUserData(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("User not found."));

        return new LoggedInUserData(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getStatus(),
                user.getRole(),
                user.getRecievePromotions(),
                user.getFavoriteMovieIds());
    }

    public User createUser(CreateUserRequest userRequest) {
        User user = new User();

        // Transfer data from request DTO to the new user object
        user.setId(null);
        user.setRole("CUSTOMER");
        user.setStatus("INACTIVE");
        user.setEmail(userRequest.email());
        user.setFirstName(userRequest.firstName());
        user.setLastName(userRequest.lastName());
        user.setPhone(userRequest.phone());
        user.setPasswordHash(passwordEncoder.encode(userRequest.password()));
        user.setHomeAddress(userRequest.homeAddress());
        user.setRecievePromotions(userRequest.recievePromotions());

        if (userRequest.paymentCards() != null) {
            if (userRequest.paymentCards().size() > 3) {
                throw new IllegalArgumentException(
                        "Users may have a maximum of 3 payment cards.");
            }

            List<PaymentCard> paymentCards = userRequest.paymentCards()
                    .stream()
                    .map(this::createPaymentCard)
                    .toList();
            user.setPaymentCards(paymentCards);
        }

        // Check if email, password, firstName, lastName, or phone are null --- Later
        // this should varify the email (maybe a frontend thing)
        if ((user.getEmail() == null)
                || (user.getPasswordHash() == null)
                || (user.getFirstName() == null)
                || (user.getLastName() == null)
                || (user.getPhone() == null)) {
            throw new IllegalArgumentException("All required fields must be filled");
        }

        // Check if the email is in use
        if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
            throw new IllegalArgumentException("A user with that email already exists");
        }

        return userRepository.save(user);
    }

    private PaymentCard createPaymentCard(AddPaymentCardRequest request) {
        PaymentCard card = new PaymentCard();
        card.setCardNumberHash(passwordEncoder.encode(request.cardNumber()));
        card.setExpirationMonth(request.expirationMonth());
        card.setExpirationYear(request.expirationYear());
        card.setBillingAddress(request.billingAddress());
        return card;
    }

    public void removePaymentCard(
            Integer userId,
            String cardId) {

        User user = getUserById(userId);

        user.getPaymentCards()
                .removeIf(card -> card.getCardId()
                        .equals(cardId));

        userRepository.save(user);
    }

    public PaymentCard addPaymentCard(
            Integer userId,
            AddPaymentCardRequest request) {

        User user = getUserById(userId);

        if (user.getPaymentCards() == null) {
            user.setPaymentCards(
                    new ArrayList<>());
        }

        if (user.getPaymentCards().size() >= 3) {
            throw new IllegalArgumentException(
                    "Maximum 3 payment cards allowed.");
        }

        PaymentCard card = new PaymentCard();

        card.setCardNumberHash(
                passwordEncoder.encode(
                        request.cardNumber()));

        card.setExpirationMonth(
                request.expirationMonth());

        card.setExpirationYear(
                request.expirationYear());

        card.setBillingAddress(
                request.billingAddress());

        user.getPaymentCards().add(card);

        userRepository.save(user);

        return card;
    }

    public void addFavorite(
            Integer userId,
            Integer movieId) {
        User user = getUserById(userId);

        int[] favorites = user.getFavoriteMovieIds();

        if (favorites != null) {
            boolean alreadyExists = Arrays.stream(favorites)
                    .anyMatch(id -> id == movieId);

            if (alreadyExists) {
                return;
            }

            int[] updated = Arrays.copyOf(
                    favorites,
                    favorites.length + 1);

            updated[updated.length - 1] = movieId;

            user.setFavoriteMovieIds(updated);
        } else {
            user.setFavoriteMovieIds(
                    new int[] { movieId });
        }

        userRepository.save(user);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User editUser(User user) {
        return userRepository.save(user);
    }

    public User getByVerificationToken(String token) {
        return userRepository.findByVerificationToken(token);
    }

    public boolean checkResetPasswordToken(
            Integer userId,
            String token) {

        User user = getUserById(userId);

        return user.getPasswordResetToken() != null
                &&
                user.getPasswordResetToken()
                        .equals(token);
    }
}
