package com.sip.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sip.entities.Settings;
import com.sip.exceptions.NotAnImageFileException;
import com.sip.services.FileStorageService;
import com.sip.services.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping("")
    public List<Settings> getAllSettings() {
        return settingsService.getAllSettings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSettingsById(@PathVariable Long id) {
        Settings settings = settingsService.getSettingsByID(id);
        if (settings != null) {
            return new ResponseEntity<>(settings, HttpStatus.OK);
        }
        return new ResponseEntity<>("This Settings doesn't exist", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<?> saveSettings(@RequestParam(name = "settings") String settings,
                                          @RequestParam(value = "logo", required = false) MultipartFile logo,
                                          @RequestParam(value = "banner", required = false) MultipartFile banner

    ) throws IOException, NotAnImageFileException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Deserialize settings with LocalTime fields
        Settings newSettings = mapper.readValue(settings, Settings.class);
        if (logo != null) {
            settingsService.saveLogo(newSettings,logo);
        }
        if (banner != null) {
            settingsService.saveBanner(newSettings,banner);
        }
        Settings result = settingsService.saveSettings(newSettings);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>("Problem with adding Settings", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateSettings(@RequestParam(name = "settings") String settings,
                                            @RequestParam(value = "logo", required = false) MultipartFile logo,
                                            @RequestParam(value = "banner", required = false) MultipartFile banner
                                            ) throws IOException, NotAnImageFileException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        Settings newSettings = mapper.readValue(settings, Settings.class);
        Settings settingsToUpdate = settingsService.getSettingsByID(newSettings.getId_settings());


        if (settingsToUpdate != null) {
            if (newSettings.getApropos()!=null) {
                settingsToUpdate.setApropos(newSettings.getApropos());
            }
            if (newSettings.getApropos2()!=null) {
                settingsToUpdate.setApropos2(newSettings.getApropos2());
            }
            if (newSettings.getApropos3()!=null) {
                settingsToUpdate.setApropos3(newSettings.getApropos3());
            }
            if (newSettings.getObjective()!=null) {
                settingsToUpdate.setObjective(newSettings.getObjective());
            }
            if (newSettings.getMission()!=null) {
                settingsToUpdate.setMission(newSettings.getMission());
            }
            if (newSettings.getVision()!=null) {
                settingsToUpdate.setVision(newSettings.getVision());
            }
            if (newSettings.getMotto()!=null) {
                settingsToUpdate.setMotto(newSettings.getMotto());
            }
            if (newSettings.getTitreService()!=null) {
                settingsToUpdate.setTitreService(newSettings.getTitreService());
            }
            if (newSettings.getTitre()!=null) {
                settingsToUpdate.setTitre(newSettings.getTitre());
            }
            if (newSettings.getEmail()!=null) {
                settingsToUpdate.setEmail(newSettings.getEmail());
            }
            if (newSettings.getTelephone()!=null) {
                settingsToUpdate.setTelephone(newSettings.getTelephone());
            }
            if (newSettings.getWhatsapp()!=null) {
                settingsToUpdate.setWhatsapp(newSettings.getWhatsapp());
            }
            if (newSettings.getDimensionLogo()!=null) {
                settingsToUpdate.setDimensionLogo(newSettings.getDimensionLogo());
            }
            if (newSettings.getAdresse()!=null) {
                settingsToUpdate.setAdresse(newSettings.getAdresse());
            }
            if (newSettings.getHeureDebut()!=null) {
                settingsToUpdate.setHeureDebut(newSettings.getHeureDebut());
            }
            if (newSettings.getHeureFin()!=null) {
                settingsToUpdate.setHeureFin(newSettings.getHeureFin());
            }
            if (logo != null) {
                settingsService.saveLogo(settingsToUpdate,logo);
            }
            if (banner != null) {
                settingsService.saveBanner(settingsToUpdate,banner);
            }
            System.out.println(settingsToUpdate);
            Settings result = settingsService.saveSettings(settingsToUpdate);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Settings not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSettings(@PathVariable Long id) {
        Settings settings = settingsService.getSettingsByID(id);
        if (settings != null) {
            settingsService.deleteSettings(id);
            return new ResponseEntity<>(settings, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Settings not found", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping(path = "/image/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getSettingsLogo( @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get("uploads/settings/" + fileName));
    }

    @GetMapping(path = "/banner/{fileName}")
    public ResponseEntity<byte[]> getSettingsBanner(@PathVariable("fileName") String fileName) throws IOException {
        Path filePath = Paths.get("uploads/settings/" + fileName).toAbsolutePath().normalize();

        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }
        byte[] fileContent = Files.readAllBytes(filePath);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(fileContent);
    }

}
