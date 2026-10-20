package com.cinemaebooking.Security;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;

import java.util.Base64;

public class EncryptionService {

    private static final String SECRET_KEY = "YourSecretKey123"; // 16 chars

    private final SecretKeySpec secretKey = new SecretKeySpec(
            SECRET_KEY.getBytes(),
            "AES");

    public String encrypt(
            String value) {

        try {

            Cipher cipher = Cipher.getInstance(
                    "AES");

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    secretKey);

            return Base64
                    .getEncoder()
                    .encodeToString(
                            cipher.doFinal(
                                    value.getBytes()));

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }

    public String decrypt(
            String value) {

        try {

            Cipher cipher = Cipher.getInstance(
                    "AES");

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    secretKey);

            return new String(
                    cipher.doFinal(
                            Base64
                                    .getDecoder()
                                    .decode(value)));

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}