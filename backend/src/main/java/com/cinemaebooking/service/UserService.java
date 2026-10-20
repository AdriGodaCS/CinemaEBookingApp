package com.cinemaebooking.service;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.AddPaymentCardRequest;
import com.cinemaebooking.model.Address;
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
import com.cinemaebooking.Security.EncryptionService;
import com.cinemaebooking.Security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cinemaebooking.model.UpdateProfileRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;

@Service
public class UserService {

        private final PasswordEncoder passwordEncoder;
        private final EncryptionService encryptionService;
        private final UserRepository userRepository;
        private final MovieService movieService;
        private final EmailService emailService;

        private final JwtUtil jwtUtil;

        public UserService(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil,
                        MovieService movieService,
                        EmailService emailService,
                        EncryptionService encryptionService) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.movieService = movieService;
                this.jwtUtil = jwtUtil;
                this.emailService = emailService;
                this.encryptionService = encryptionService;
        }

        public User getUserById(
                        Integer id) {

                User user = getStoredUserById(id);

                if (user.getPaymentCards() != null) {

                        user.setPaymentCards(
                                        decryptCards(
                                                        user.getPaymentCards()));
                }

                return user;
        }

        public User updateProfile(
                        Integer id,
                        UpdateProfileRequest request) {
                User user = getStoredUserById(id);

                user.setFirstName(request.firstName());
                user.setLastName(request.lastName());
                user.setPhone(request.phone());
                user.setHomeAddress(request.homeAddress());
                user.setRecievePromotions(
                                request.recievePromotions());

                return userRepository.save(user);
        }

        public void sendPasswordResetEmail(
                        String email) {

                Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(
                                email);

                if (optionalUser.isEmpty()) {
                        return;
                }

                User user = optionalUser.get();

                String token = UUID.randomUUID().toString();

                user.setPasswordResetToken(
                                token);

                userRepository.save(user);

                emailService.sendEmailToChangePassword(
                                user.getEmail(),
                                user.getId(),
                                token);
        }

        public void resetPassword(
                        ResetPasswordRequest request) {

                User user = getStoredUserById(
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
                User user = getStoredUserById(userId);

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
                User user = getStoredUserById(userId);

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

                if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
                        throw new IllegalStateException(
                                        "Account is not verified. Please check your email to verify your account.");
                }

                if ("SUSPENDED".equalsIgnoreCase(user.getStatus())) {
                        throw new IllegalStateException(
                                        "Your account has been suspended.");
                }

                String token = jwtUtil.generateToken(user.getId(), user.getEmail());

                LoggedInUserData userData = new LoggedInUserData(
                                user.getId(),
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
                                user.getId(),
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
                Integer nextId = userRepository.findTopByOrderByIdDesc()
                                .map(existingUser -> existingUser.getId() + 1)
                                .orElse(1);

                user.setId(nextId);
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

                        List<PaymentCard> paymentCards = new ArrayList<>(
                                        userRequest.paymentCards()
                                                        .stream()
                                                        .map(this::createPaymentCard)
                                                        .toList());
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
                card.setCardId(UUID.randomUUID().toString());
                card.setCardNumberHash(
                                encryptionService.encrypt(
                                                request.cardNumber()));

                card.setExpirationMonth(
                                encryptionService.encrypt(
                                                String.valueOf(
                                                                request.expirationMonth())));

                card.setExpirationYear(
                                encryptionService.encrypt(
                                                String.valueOf(
                                                                request.expirationYear())));
                Address address = new Address();

                address.setStreet(
                                encryptionService.encrypt(
                                                request.billingAddress()
                                                                .getStreet()));

                address.setCity(
                                encryptionService.encrypt(
                                                request.billingAddress()
                                                                .getCity()));

                address.setState(
                                encryptionService.encrypt(
                                                request.billingAddress()
                                                                .getState()));

                address.setZipCode(
                                encryptionService.encrypt(
                                                request.billingAddress()
                                                                .getZipCode()));

                card.setBillingAddress(
                                address);
                return card;
        }

        public void removePaymentCard(
                        Integer userId,
                        String cardId) {

                User user = getStoredUserById(userId);

                user.getPaymentCards()
                                .removeIf(card -> card.getCardId()
                                                .equals(cardId));

                userRepository.save(user);
        }

        public PaymentCard addPaymentCard(
                        Integer userId,
                        AddPaymentCardRequest request) {

                User user = getStoredUserById(userId);

                if (user.getPaymentCards() == null) {
                        user.setPaymentCards(
                                        new ArrayList<>());
                }

                if (user.getPaymentCards().size() >= 3) {
                        throw new IllegalArgumentException(
                                        "Maximum 3 payment cards allowed.");
                }

                PaymentCard card = createPaymentCard(
                                request);

                user.getPaymentCards()
                                .add(card);

                userRepository.save(user);

                return card;
        }

        private List<PaymentCard> decryptCards(
                        List<PaymentCard> cards) {

                if (cards == null) {
                        return Collections.emptyList();
                }

                return cards.stream()
                                .map(this::decryptCard)
                                .toList();
        }

        private PaymentCard decryptCard(
                        PaymentCard encryptedCard) {

                PaymentCard card = new PaymentCard();

                card.setCardId(
                                encryptedCard.getCardId());

                card.setCardNumberHash(
                                encryptionService.decrypt(
                                                encryptedCard.getCardNumberHash()));

                card.setExpirationMonth(
                                encryptionService.decrypt(
                                                encryptedCard.getExpirationMonth()));

                card.setExpirationYear(
                                encryptionService.decrypt(
                                                encryptedCard.getExpirationYear()));

                Address address = new Address();

                address.setStreet(
                                encryptionService.decrypt(
                                                encryptedCard
                                                                .getBillingAddress()
                                                                .getStreet()));

                address.setCity(
                                encryptionService.decrypt(
                                                encryptedCard
                                                                .getBillingAddress()
                                                                .getCity()));

                address.setState(
                                encryptionService.decrypt(
                                                encryptedCard
                                                                .getBillingAddress()
                                                                .getState()));

                address.setZipCode(
                                encryptionService.decrypt(
                                                encryptedCard
                                                                .getBillingAddress()
                                                                .getZipCode()));

                card.setBillingAddress(
                                address);

                return card;
        }

        public void addFavorite(
                        Integer userId,
                        Integer movieId) {
                User user = getStoredUserById(userId);

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

        private User getStoredUserById(
                        Integer id) {

                return userRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "User not found with id: " + id));
        }

        public boolean checkResetPasswordToken(
                        Integer userId,
                        String token) {

                User user = getStoredUserById(userId);

                return user.getPasswordResetToken() != null
                                &&
                                user.getPasswordResetToken()
                                                .equals(token);
        }
}
