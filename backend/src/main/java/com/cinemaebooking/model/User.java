package com.cinemaebooking.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "users")
public class User {
    @Id 
    private Integer id;

    private String role;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String phone;

    @Field("password_hash")
    private String passwordHash;

    private String status;

    @Field("payment_cards")
    private List<PaymentCard> paymentCards;

    private Address homeAddress;

    @Field("favorite_movie_ids")
    private int[] favoriteMovieIds;

    private String verificationToken;

    @Field("recieve_promotions")
    private Boolean recievePromotions;

    //private ... preferences;

    // Constructors
    public User() {}

    public User(String firstName, String email, String passwordHash) {
        this.firstName = firstName;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    // getter/setter methods

    // id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // role
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // firstName
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    // lastName
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    // email
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    // phone
    public void setPhone(String phone) {
        this.phone = phone;
    }

    // passwordHash
    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    // status
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // paymentCards
    public List<PaymentCard> getPaymentCards() {
        return paymentCards;
    }

    public void setPaymentCards(List<PaymentCard> paymentCards)  {
        this.paymentCards = paymentCards;
    }

    // homeAddress
    public Address getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(Address homeAddress) {
        this.homeAddress = homeAddress;
    }

    // favoriteMovieIds
    public int[] getFavoriteMovieIds() {
        return favoriteMovieIds;
    }

    public void setFavoriteMovieIds(int[] favoriteMovieIds) {
        this.favoriteMovieIds = favoriteMovieIds;
    }

    // verificationToken
    public String getVerificationToken() {
        return verificationToken;
    }
    
    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    // homeAddress
    public Boolean getRecievePromotions() {
        return recievePromotions;
    }

    public void setRecievePromotions(Boolean recievePromotions) {
        this.recievePromotions = recievePromotions;
    }
}
