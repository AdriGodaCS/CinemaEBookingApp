package com.cinemaebooking.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import java.util.Date;

@Component 
public class JwtUtil {

    private static final String SECRET =
            "cinema-e-booking-super-secret-key-123456789";

    private static final SecretKey KEY =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    private static final long EXPIRATION =
            1000 * 60 * 60 * 24;

    public static String generateToken(
            Integer userId,
            String email
    ) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION
                        )
                )
                .signWith(KEY)
                .compact();
    }

    public static Claims getClaims(
            String token
    ) {
        return Jwts.parser()
                .verifyWith(KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static Integer getUserId(
            String token
    ) {
        return getClaims(token)
                .get("userId", Integer.class);
    }

    public static String getEmail(
            String token
    ) {
        return getClaims(token)
                .getSubject();
    }

    public static boolean isValid(
            String token
    ) {
        try {
            getClaims(token);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }
}