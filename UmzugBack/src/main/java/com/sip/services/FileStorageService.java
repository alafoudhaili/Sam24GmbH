package com.sip.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class FileStorageService {

    @Value("${filestoragePath}")
    private String filestoragePath;

    private final Map<String, Path> directories = new HashMap<>();

    @PostConstruct
    public void init() {
        directories.put("users", Paths.get(filestoragePath, "users"));
        directories.put("settings", Paths.get(filestoragePath, "settings"));
        directories.put("sponsors", Paths.get(filestoragePath, "sponsors"));
        directories.put("services", Paths.get(filestoragePath, "services"));
        directories.put("registre", Paths.get(filestoragePath, "registre"));
        directories.put("collaborateurs", Paths.get(filestoragePath, "collaborateurs"));
        directories.put("logos", Paths.get(filestoragePath, "logos"));

        directories.forEach((key, path) -> {
            try {
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }
            } catch (IOException e) {
                throw new RuntimeException("Could not initialize folder for " + key, e);
            }
        });
    }

    public Path getPathForType(String fileType) {
        Path path = directories.get(fileType);
        if (path == null) {
            throw new IllegalArgumentException("Invalid file type specified");
        }
        return path;
    }

    public String save(MultipartFile file, String folder) {
        try {
            // Nettoyer le nom du fichier pour s'assurer qu'il est sans chemin fictif
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            if (fileName.contains("..")) {
                throw new NoSuchElementException("Invalid filename: " + fileName);
            }

            // Obtenir le chemin de destination pour le type de fichier
            Path targetLocation = getPathForType(folder).resolve(fileName);

            // Copier le fichier dans le répertoire cible
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retourne uniquement le nom du fichier (par exemple, cv-test.pdf)
            return fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    public boolean deleteFileByName(String name, String folder) {
        Path file = getPathForType(folder).resolve(name);
        try {
            if (Files.exists(file)) {
                Files.delete(file);
                return true;
            }
            return false;
        } catch (IOException e) {
            throw new RuntimeException("Could not delete the file: " + name, e);
        }
    }

    public Resource load(String filename, String folder) {
        try {
            Path directoryPath = getPathForType(folder);
            Path file = directoryPath.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }}
