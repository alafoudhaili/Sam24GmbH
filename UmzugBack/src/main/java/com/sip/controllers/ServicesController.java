package com.sip.controllers;

import com.sip.entities.Services;
import com.sip.services.ServicesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/services")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ServicesController {
    private final ServicesService servicesService;

    @GetMapping("")
    public List<Services> getAllServices() {
        return servicesService.getAllServices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServicesById(@PathVariable Long id) {
        Services services = servicesService.getServicesByID(id);
        if (services != null) {
            return new ResponseEntity<>(services, HttpStatus.OK);
        }
        return new ResponseEntity<>("This Services doesn't exist", HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<?> saveServices (@RequestBody Services newServices) {

        Services result = servicesService.saveServices(newServices);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>("Problem with adding Services", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateServices(@RequestBody Services newServices) {
        Services servicesToUpdate = servicesService.getServicesByID(newServices.getId_services());

        if (servicesToUpdate != null) {
            if (newServices.getDescription()!=null) {
                servicesToUpdate.setDescription(newServices.getDescription());
            }
            if (newServices.getTitre()!=null) {
                servicesToUpdate.setTitre(newServices.getTitre());
            }

            Services result = servicesService.saveServices(servicesToUpdate);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Services not found", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteServices(@PathVariable Long id) {
        Services services = servicesService.getServicesByID(id);
        if (services != null) {
            servicesService.deleteServices(id);
            return new ResponseEntity<>(services, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Services not found", HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping(path = "/image/{fileName}", produces = IMAGE_JPEG_VALUE)
    public byte[] getServicesLogo( @PathVariable("fileName") String fileName) throws IOException {
        return Files.readAllBytes(Paths.get("uploads/Services/" + fileName));
    }
}


