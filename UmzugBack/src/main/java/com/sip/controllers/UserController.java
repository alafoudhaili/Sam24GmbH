package com.sip.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sip.entities.User;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;

import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("")
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserByID(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }
        return new ResponseEntity<>("this user doesn't exist", HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<?> saveUser(@RequestParam(name = "user") String user,
                                      @RequestParam(value = "photoProfil", required = false) MultipartFile photoProfil

    ) throws IOException, NoSuchFieldException, NotAnImageFileException {
        User userToSave = new ObjectMapper().readValue(user, User.class);

        if (photoProfil != null) {
            userService.saveProfileImage(userToSave,photoProfil);
        }

        User result = userService.saveUser(userToSave);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>("problem with adding user", HttpStatus.OK);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity deleteUser(@PathVariable Long id) {
        User request = this.userService.getUserByID(id);
        userService.deleteUserById(request.getId_user());

        if (request!=null){
            return new ResponseEntity<>(request, HttpStatus.OK);
        }
        return new ResponseEntity<>("this user doesn't exist", HttpStatus.BAD_REQUEST);
    }




    @PutMapping("/active")
    public ResponseEntity activerCompte(@RequestBody User user) {
        userService.activerCompte(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PutMapping("/inactive")
    public ResponseEntity desactiverCompte(@RequestBody User user) {
       userService.desactiverCompte(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping(path = "/image/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getProfileImage( @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get("uploads/users/" + fileName));
    }
    @GetMapping(path = "/imagePdf/{fileName}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> getRegisterPdf(@PathVariable("fileName") String fileName) throws IOException {
        Path pdfPath = Paths.get("uploads/registre/" + fileName);
        byte[] pdfBytes = Files.readAllBytes(pdfPath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
    @GetMapping("/byEmail/{email}")
    public User getUserByEmail(@PathVariable String email ) {
        User user = userService.getUserByEmail(email);
        return user;
    }

    @GetMapping("/admins")
    public List<User> getAdmins() {
        List<User> users = userService.getAdmins();
        return users;
    }
    @GetMapping("/mitarbeiter")
    public List<User> getMitarbeiter() {
        List<User> users = userService.getMitarbeiters();
        return users;
    }

}
