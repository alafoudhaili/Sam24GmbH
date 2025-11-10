package com.sip.services;

import com.sip.entities.Element;
import com.sip.entities.Room;
import com.sip.entities.Settings;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.repositories.ElementRepository;
import com.sip.repositories.RoomRepository;
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
public class ElementService {
    @Value("${filestoragePath}")
    private String filestoragePath;

    // We'll expose images later like /api/elements/image/{fileName}
    public static final String ELEMENT_IMAGE_PATH = "/api/element/image";
    public static final String DIRECTORY_CREATED = "Created directory for: ";
    public static final String FILE_SAVED_IN_FILE_SYSTEM = "Saved file in file system by name: ";
    public static final String NOT_AN_IMAGE_FILE = " is not an image file. Please upload an image file";

    public static final String FORWARD_SLASH = "/";
    private final ElementRepository elementRepository;


    public List<Element> getAll() {
        return elementRepository.findAll();
    }

    public Element getById(Long id) {

        return elementRepository.findById(id).orElse(null);
    }


    public Element save(Element element) {
        return elementRepository.save(element);
    }

    public void delete(Long id) {
        if (elementRepository.existsById(id)) {
            elementRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Element not found with id: " + id);
        }
    }
    public void saveElementImage(Element element, MultipartFile image) throws IOException, NotAnImageFileException {
        if (image != null) {
            if (!Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE).contains(image.getContentType())) {
                throw new NotAnImageFileException(image.getOriginalFilename() + NOT_AN_IMAGE_FILE);
            }
            String originalFileName = image.getOriginalFilename();
            String fileName = originalFileName != null ? originalFileName : "default-name";
            Path imagePath = Paths.get(filestoragePath, "element", fileName).toAbsolutePath().normalize();
            if (!Files.exists(imagePath.getParent())) {
                Files.createDirectories(imagePath.getParent());
                LOGGER.info(DIRECTORY_CREATED + imagePath.getParent().toString());
            }
            Files.deleteIfExists(imagePath);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            element.setImageUrl(buildImageUrl(fileName));
            LOGGER.info(FILE_SAVED_IN_FILE_SYSTEM + fileName);
            System.out.println();
        }
    }



    private String buildImageUrl(String fileName) {
        String encodedFileName = UriUtils.encodePath(fileName, "UTF-8");
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path(ELEMENT_IMAGE_PATH + FORWARD_SLASH + encodedFileName)
                .toUriString();
    }
}
