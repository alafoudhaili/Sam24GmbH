package com.sip.authentication;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sip.entities.User;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.services.FileStorageService;
import com.sip.services.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final JavaMailSender mailSender;
    private final FileStorageService fileStorageService;
    private final Map<String, User> temporaryUsers = new HashMap<>();

    @Value("${spring.mail.username}")
    private String fromEmail;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam(name = "user") String userJson,
            @RequestParam(value = "photoProfil", required = false) MultipartFile photoProfil,
            @RequestParam(value = "registreCommerce", required = false) MultipartFile registreCommerce

    ) throws JsonProcessingException {
        User newUser = new ObjectMapper().readValue(userJson, User.class);
        String confirmationCode = UUID.randomUUID().toString().substring(0, 6);

        try {
            if (photoProfil != null) {
                userService.saveProfileImage(newUser, photoProfil);
            }

            newUser.setConfirmationCode(confirmationCode);

            temporaryUsers.put(newUser.getEmail(), newUser);
            try {
                sendEMail(newUser.getEmail(), newUser.getPrenom(), newUser.getNom(), confirmationCode);
            } catch (MessagingException e) {
                System.err.println("Erreur complète: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Problème envoi de mail");
            }

            return ResponseEntity.ok(newUser);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("/confirm-register")
    public ResponseEntity<?> confirmRegister(
            @RequestParam(name = "email") String email,
            @RequestParam(name = "confirmationCode") String confirmationCode) throws NoSuchFieldException, MessagingException {
        User tempUser = temporaryUsers.get(email);

        if (tempUser == null) {
            return new ResponseEntity<>("User not found or registration has expired.", HttpStatus.NOT_FOUND);
        }
        if (!tempUser.getConfirmationCode().equals(confirmationCode)) {
            return new ResponseEntity<>("Invalid confirmation code.", HttpStatus.BAD_REQUEST);
        }
        tempUser.setConfirmationCode(null);
        temporaryUsers.remove(email);
        return ResponseEntity.ok(authenticationService.register(tempUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login
            (@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authenticationService.login(request));
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);

        }
    }


    private void sendEMail(String email, String prenom, String nom, String confirmationCode) throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail,"Xsupply");
        helper.setTo(email.trim());

        String subject = "Confirmation of Your Registration";
        String content = "<html>" +
                "<body style=\"font-family: Arial, sans-serif; color: #333;\">" +
                "<div style=\"text-align: center; padding: 10px; border-bottom: 3px solid blue;\">" +
                "<img src='cid:logoImage' style='height: 200px; width: auto;' />" +
                "</div>" +
                "<h3>Dear " + nom + " " + prenom + ",</h3>" +
                "<p>We are pleased to inform you that your registration has been successfully recorded.</p>" +
                "<p>To complete your registration, please enter the following confirmation code:</p>" +
                "<div style=\"font-size: 24px; font-weight: bold; color: #007bff; padding: 10px; background-color: #f0f0f0; text-align: center;\">" +
                confirmationCode +
                "</div>" +
                "<p>Thank you for your registration. If you did not initiate this request, please ignore this email.</p>" +
                "</body>" +
                "</html>";

        helper.setSubject(subject);
        helper.setText(content, true);

        File logo = new File("uploads/settings/xsupply.png");
        helper.addInline("logoImage", logo);

        mailSender.send(message);
    }

}

