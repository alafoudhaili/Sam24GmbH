package com.sip.controllers;

import com.sip.entities.ResponseMessage;
import com.sip.entities.Kitchen;
import com.sip.services.KitchenService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/kitchen")
@CrossOrigin(origins = "*", maxAge = 3600)
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("")
    public ResponseEntity<List<Kitchen>> getAll() {
        List<Kitchen> kitchens = kitchenService.getAll();
        return new ResponseEntity<>(kitchens, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Kitchen kitchen = kitchenService.getById(id);
        if (kitchen != null) {
            return new ResponseEntity<>(kitchen, HttpStatus.OK);
        }
        return new ResponseEntity<>(
                new ResponseMessage("Kitchen not found with id: " + id),
                HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<?> create(@RequestBody Kitchen kitchen) {
        try {
            Kitchen createdKitchen = kitchenService.save(kitchen);
            return new ResponseEntity<>(createdKitchen, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseMessage("Error creating Kitchen: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Kitchen kitchen) {
        try {
            Kitchen updatedKitchen = kitchenService.update(id, kitchen);
            return new ResponseEntity<>(updatedKitchen, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(
                    new ResponseMessage(e.getMessage()),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseMessage("Error updating Kitchen: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            Kitchen kitchen = kitchenService.getById(id);
            if (kitchen != null) {
                kitchenService.delete(id);
                return new ResponseEntity<>(
                        new ResponseMessage("Kitchen deleted successfully"),
                        HttpStatus.OK);
            }
            return new ResponseEntity<>(
                    new ResponseMessage("Kitchen not found with id: " + id),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseMessage("Error deleting Kitchen: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}