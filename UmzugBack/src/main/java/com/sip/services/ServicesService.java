package com.sip.services;

import com.sip.entities.Services;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.repositories.ServicesRepository;
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
import static org.springframework.http.MediaType.IMAGE_GIF_VALUE;

@Service
@RequiredArgsConstructor
public class ServicesService {

    private final ServicesRepository servicesRepository;

    public List<Services> getAllServices() {
        return servicesRepository.findAll();
    }

    public Services getServicesByID(long id) {
        return servicesRepository.findById(id).orElse(null);
    }

    public Services saveServices(Services Services) {
        return servicesRepository.save(Services);
    }

    public void deleteServices(Long id) {
        if (servicesRepository.existsById(id)) {
            servicesRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Services not found with id: " + id);
        }
    }
}

