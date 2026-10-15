package com.cinemaebooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "reset_password_tokens")
public class ResetPasswordToken {
    @Id
    private String tokenId;

    
}
