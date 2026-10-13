package com.cinemaebooking.service;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.AddPaymentCardRequest;
import com.cinemaebooking.model.ChangePasswordRequest;
import com.cinemaebooking.model.CreateUserRequest;
import com.cinemaebooking.model.Movie;
import com.cinemaebooking.model.PaymentCard;
import com.cinemaebooking.repository.UserRepository;
import com.cinemaebooking.security.SecurityConfig;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cinemaebooking.model.UpdateProfileRequest;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final MovieService movieService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, MovieService movieService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.movieService = movieService;
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

        userRepository.save(user);
    }

    public User getUserByEmailAndPassword(String email, String password) {
        User user = getUserByEmail(email);

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect password.");
        }

        return user;
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

        int[] updatedFavorites = Arrays.stream(user.getFavoriteMovieIds())
                .filter(id -> id != movieId)
                .toArray();

        user.setFavoriteMovieIds(updatedFavorites);

        userRepository.save(user);
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

    // Private methods

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + email));
    }

}
