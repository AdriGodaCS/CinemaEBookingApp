package com.cinemaebooking.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, Integer userId, String token) {
        String verificationLink = "http://localhost:5173/verifyaccount?userId="
            + userId
            + "&token="
            + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Verify Your Account");
            helper.setText("<p>Click the link below to verify your account:</p>"
                    + "<a href=\"" + verificationLink + "\">Verify Account</a>", true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendEmailForUpdataProfile(String toEmail) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Profile Updated");
            helper.setText("<p>Your profile has just been updated.</p>", true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendEmailToChangePassword(
            String toEmail,
            Integer userId,
            String token) {

        String resetPasswordLink = "http://localhost:5173/reset-password"
                + "?userId="
                + userId
                + "&token="
                + token;

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    true);

            helper.setTo(toEmail);

            helper.setSubject(
                    "Password Change Request");

            helper.setText(
                    "<p>Follow the link below to reset your password.</p>"
                            + "<p>"
                            + "<a href=\""
                            + resetPasswordLink
                            + "\">Reset Password</a>"
                            + "</p>",
                    true);

            mailSender.send(message);

        } catch (MessagingException e) {

            throw new RuntimeException(
                    "Failed to send password reset email",
                    e);
        }
    }
}