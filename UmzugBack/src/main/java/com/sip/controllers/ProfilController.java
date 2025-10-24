package com.sip.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sip.entities.User;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.repositories.UserRepository;
import com.sip.services.FileStorageService;
import com.sip.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/profil")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfilController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;




    @PutMapping(value = "/photo")
    public ResponseEntity<?> updatePhoto(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "newPhoto", required = false) MultipartFile newPhoto
    ) throws IOException, NotAnImageFileException {

        User userToUpdate = userService.getUserByID(id);
        if (newPhoto != null) {
            userService.saveProfileImage(userToUpdate,newPhoto);
        }
        try {
            User result = userRepository.save(userToUpdate);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}




