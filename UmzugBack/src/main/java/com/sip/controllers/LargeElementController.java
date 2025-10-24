package com.sip.controllers;

import com.sip.entities.ResponseMessage;
import com.sip.entities.LargeElement;
import com.sip.services.LargeElementService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/largeElement")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LargeElementController {

    private final LargeElementService largeElementService;

    @GetMapping("")
    public ResponseEntity<List<LargeElement>> getAll() {
        List<LargeElement> elements = largeElementService.getAll();
        return new ResponseEntity<>(elements, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        LargeElement element = largeElementService.getById(id);
        if (element != null) {
            return new ResponseEntity<>(element, HttpStatus.OK);
        }
        return new ResponseEntity<>("LargeElement not found with id: " + id, HttpStatus.NOT_FOUND);
    }

    @PostMapping("/add")
    public ResponseEntity<?> create(@RequestBody LargeElement largeElement) {
        try {
            LargeElement createdElement = largeElementService.save(largeElement);
            return new ResponseEntity<>(createdElement, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseMessage("Error creating LargeElement: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody LargeElement largeElement) {
        try {
            LargeElement updatedElement = largeElementService.update(id, largeElement);
            return new ResponseEntity<>(updatedElement, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(
                    new ResponseMessage(e.getMessage()),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseMessage("Error updating LargeElement: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            LargeElement element = largeElementService.getById(id);
            if (element != null) {
                largeElementService.delete(id);
                return new ResponseEntity<>(
                        new ResponseMessage("LargeElement deleted successfully"),
                        HttpStatus.OK);
            }
            return new ResponseEntity<>(
                    new ResponseMessage("LargeElement not found with id: " + id),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ResponseMessage("Error deleting LargeElement: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}