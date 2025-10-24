package com.sip.services;

import com.sip.entities.Role;
import com.sip.entities.User;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

import static org.hibernate.sql.ast.SqlTreeCreationLogger.LOGGER;
import static org.springframework.http.MediaType.*;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${filestoragePath}")
    private String filestoragePath;
    public static final String USER_PATH = "/api/user/image";

    public static final String REGISTRE_PATH = "/api/user/imagePdf";

    public static final String DIRECTORY_CREATED = "Created directory for: ";
    public static final String FILE_SAVED_IN_FILE_SYSTEM = "Saved file in file system by name: ";
    public static final String FORWARD_SLASH = "/";
    public static final String NOT_AN_IMAGE_FILE = " is not an image file. Please upload an image file";

    public User saveUser(User user) throws NoSuchFieldException {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new NoSuchFieldException("Username or email already exists.");
        }

        String roleUser;
        Role role;

        roleUser = String.valueOf((user.getRole()));

        switch (roleUser) {
            case "ADMIN":
                role = Role.ADMIN;
                break;
            case "MITARBEITER":
                role = Role.MITARBEITER;
                break;

            default:
                role = Role.MITARBEITER;
                break;
        }

        user.setRole(role);
        user.setActive(true);

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    public User getUserByID(Long id) {

        return this.userRepository.findById(id).orElse(null);
    }

    public void deleteUserById(Long id) {

        this.userRepository.deleteById(id);
    }


    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAdmins() {
        return userRepository.findAdmins();
    }

    public List<User> getMitarbeiters() {
        return userRepository.findMitarbieter();
    }

    public void updateResetPasswordToken(String token, String email) throws UsernameNotFoundException {
        var user = userRepository.findByEmail(email);
        if (user != null) {
            user.setResetPasswordToken(token);
            try {
                userRepository.save(user);
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            }
        } else {
            throw new UsernameNotFoundException("Utilisateur non trouvé");
        }
    }

    public User getUserByResetPasswordToken(String resetPasswordToken) {
        return userRepository.findByResetPasswordToken(resetPasswordToken);
    }

    public void updatePassword(User user, String newPassword) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(encodedPassword);
        user.setResetPasswordToken(null);
        try {
            userRepository.save(user);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    public void desactiverCompte(User user) {

        user.setActive(false);
        try {
            userRepository.save(user);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    public void activerCompte(User user) {

        user.setActive(true);
        try {
            userRepository.save(user);
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    public void saveProfileImage(User user, MultipartFile image) throws IOException, NotAnImageFileException {
        if (image != null) {
            if (!Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE).contains(image.getContentType())) {
                throw new NotAnImageFileException(image.getOriginalFilename() + NOT_AN_IMAGE_FILE);
            }
            String originalFileName = image.getOriginalFilename();
            String fileName = originalFileName != null ? originalFileName : "default-name";
            Path imagePath = Paths.get(filestoragePath, "users", fileName).toAbsolutePath().normalize();
            if (!Files.exists(imagePath.getParent())) {
                Files.createDirectories(imagePath.getParent());
                LOGGER.info(DIRECTORY_CREATED + imagePath.getParent().toString());
            }
            Files.deleteIfExists(imagePath);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            user.setPhotoProfil(setProfileImageUrl(fileName));
            LOGGER.info(FILE_SAVED_IN_FILE_SYSTEM + fileName);
        }
    }


    public String setProfileImageUrl(String fileName) {
        String encodedFileName = UriUtils.encodePath(fileName, "UTF-8");
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(USER_PATH + FORWARD_SLASH + encodedFileName)
                .toUriString();
    }



}

