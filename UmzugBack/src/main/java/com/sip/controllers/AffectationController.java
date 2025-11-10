package com.sip.controllers;

import com.sip.entities.Affectation;
import com.sip.entities.Request;
import com.sip.services.AffectationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sip.entities.User;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)

public class AffectationController {

    private final AffectationService affectationService;



    // Endpoint to assign a user to a request
    @PostMapping("/assign")
    public ResponseEntity<List<Affectation>> assignUsersToRequest(@RequestParam List<Long> userIds, @RequestParam Long requestId) {
        List<Affectation> affectations = affectationService.assignUsersToRequest(userIds, requestId);
        return ResponseEntity.ok(affectations);
    }

    // Endpoint to get all requests associated with a specific user
    @GetMapping("/user/{userId}/requests")
    public ResponseEntity<List<Request>> getRequestsByUser(@PathVariable Long userId) {
        List<Request> requests = affectationService.getRequestsByUser(userId);
        return ResponseEntity.ok(requests);
    }
    @GetMapping("/{userId}/requests/weekly")
    public ResponseEntity<List<Request>> getWeeklyRequestsByUser(@PathVariable Long userId) {
        try {
            List<Request> requests = affectationService.getWeeklyRequestsByUser(userId);
            return ResponseEntity.ok(requests);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // Endpoint to get all users associated with a specific request
    @GetMapping("/request/{requestId}/users")
    public ResponseEntity<List<User>> getUsersByRequest(@PathVariable Long requestId) {
        List<User> users = affectationService.getUsersByRequest(requestId);
        return ResponseEntity.ok(users);
    }
}
