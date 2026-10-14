package com.cinemaebooking.service;

import com.cinemaebooking.model.User;
import com.cinemaebooking.model.CreateUserRequest;
import com.cinemaebooking.model.LoggedInUserData;
import com.cinemaebooking.model.LoginRequest;
import com.cinemaebooking.model.LoginResponse;
import com.cinemaebooking.repository.UserRepository;
import com.cinemaebooking.security.SecurityConfig;
import com.cinemaebooking.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.BadCredentialsException;

@Service 
public class UserService {
    
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    public UserService(
        UserRepository userRepository, 
        PasswordEncoder passwordEncoder,
        JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    public LoginResponse loginUser(LoginRequest request) {
        
        User user = userRepository.findByEmailIgnoreCase(request.email())
            .orElseThrow(() ->
                new BadCredentialsException(
                    "Invalid email or password"
            )
        );
    
    boolean passwordMatches = passwordEncoder.matches(
        request.password(),
        user.getPasswordHash()
    );
    
    if (!passwordMatches) {
        throw new BadCredentialsException(
"Invalid email or password"
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
        user.getFavoriteMovieIds()
    );
    
    return new LoginResponse(
        token,
"Bearer",
        userData
    );
}

public LoggedInUserData getLoggedInUserData(String email) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() ->
            new BadCredentialsException("User not found.")
    );

    return new LoggedInUserData(
        user.getEmail(),
        user.getFirstName(),
        user.getLastName(),
        user.getPhone(),
        user.getStatus(),
        user.getRole(),
        user.getRecievePromotions(),
        user.getFavoriteMovieIds()
    );
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
    
    // Check if email, password, firstName, lastName, or phone are null --- Later this should varify the email (maybe a frontend thing)
    if ((user.getEmail() == null) 
        || (user.getPasswordHash() == null)
    || (user.getFirstName() == null)
    || (user.getLastName() == null)
    || (user.getPhone() == null)
) {
    throw new IllegalArgumentException("All required fields must be filled");
}

// Check if the email is in use
if (userRepository.existsByEmailIgnoreCase(user.getEmail())) {
    throw new IllegalArgumentException("A user with that email already exists");
}

return userRepository.save(user);
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
    .orElseThrow(() -> 
    new IllegalArgumentException("No user found with email: " + email)
);
}
}
