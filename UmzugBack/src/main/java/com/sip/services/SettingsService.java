package com.sip.services;

import com.sip.entities.Settings;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.repositories.SettingsRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
@RequiredArgsConstructor
public class SettingsService {

    @Value("${filestoragePath}")
    private String filestoragePath;
    public static final String SETTINGS_PATH = "/api/settings/image";
    public static final String BANNER_PATH = "/api/settings/banner";
    public static final String DIRECTORY_CREATED = "Created directory for: ";
    public static final String FILE_SAVED_IN_FILE_SYSTEM = "Saved file in file system by name: ";
    public static final String FORWARD_SLASH = "/";
    public static final String NOT_AN_IMAGE_FILE = " is not an image file. Please upload an image file";
    private final SettingsRepository settingsRepository;

    public List<Settings> getAllSettings() {
        return settingsRepository.findAll();
    }

    public Settings getSettingsByID(long id) {
        return settingsRepository.findById(id).orElse(null);
    }

    public Settings saveSettings(Settings settings) {
        return settingsRepository.save(settings);
    }

    public void deleteSettings(Long id) {
        if (settingsRepository.existsById(id)) {
            settingsRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Settings not found with id: " + id);
        }
    }

    public void saveLogo(Settings settings, MultipartFile image) throws IOException, NotAnImageFileException {
        if (image != null) {
            if (!Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE).contains(image.getContentType())) {
                throw new NotAnImageFileException(image.getOriginalFilename() + NOT_AN_IMAGE_FILE);
            }
            String originalFileName = image.getOriginalFilename();
            String fileName = originalFileName != null ? originalFileName : "default-name";
            Path imagePath = Paths.get(filestoragePath, "settings", fileName).toAbsolutePath().normalize();
            if (!Files.exists(imagePath.getParent())) {
                Files.createDirectories(imagePath.getParent());
                LOGGER.info(DIRECTORY_CREATED + imagePath.getParent().toString());
            }
            Files.deleteIfExists(imagePath);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            settings.setLogo(setLogoUrl(fileName));
            LOGGER.info(FILE_SAVED_IN_FILE_SYSTEM + fileName);
            System.out.println();
        }
    }

    public String setLogoUrl(String fileName) {
        String encodedFileName = UriUtils.encodePath(fileName, "UTF-8");
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(SETTINGS_PATH + FORWARD_SLASH + encodedFileName)
                .toUriString();
    }



    public void saveBanner(Settings settings, MultipartFile banner) throws IOException, NotAnImageFileException {
        if (banner != null) {
            String contentType = banner.getContentType();

            if (!isSupportedMediaType(contentType)) {
                throw new NotAnImageFileException(banner.getOriginalFilename() + " is not a supported file type.");
            }

            String originalFileName = banner.getOriginalFilename();
            String fileName = originalFileName != null ? originalFileName : "default-banner";
            Path filePath = Paths.get(filestoragePath, "settings", fileName).toAbsolutePath().normalize();
            if (!Files.exists(filePath.getParent())) {
                Files.createDirectories(filePath.getParent());
                LOGGER.info("Directory created: " + filePath.getParent().toString());
            }
            Files.deleteIfExists(filePath);
            Files.copy(banner.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            settings.setBanner(setMediaUrl(fileName));
            LOGGER.info("File saved in file system: " + fileName);
        }
    }

    private boolean isSupportedMediaType(String contentType) {
        List<String> supportedImageTypes = Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE);
        List<String> supportedVideoTypes = Arrays.asList("video/mp4", "video/webm", "video/ogg");

        return supportedImageTypes.contains(contentType) || supportedVideoTypes.contains(contentType);
    }

    public String setMediaUrl(String fileName) {
        String encodedFileName = UriUtils.encodePath(fileName, "UTF-8");
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(BANNER_PATH + FORWARD_SLASH + encodedFileName)
                .toUriString();
    }

}
