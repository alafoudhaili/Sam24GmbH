package com.sip.services;

import com.sip.entities.Affectation;
import com.sip.entities.Request;
import com.sip.entities.User;
import com.sip.repositories.AffectationRepository;
import com.sip.repositories.RequestRepository;
import com.sip.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class AffectationService {

    private final AffectationRepository affectionRepository;
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;



    // Method to assign a user to a request (create an affection record)
    public List<Affectation> assignUsersToRequest(List<Long> userIds, Long requestId) {
        // Find the request by ID
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        // Find all users by their IDs
        List<User> users = userRepository.findAllById(userIds);

        // Check if all users exist, otherwise throw an exception
        if (users.size() != userIds.size()) {
            throw new IllegalArgumentException("Some users not found");
        }

        // Create and save the affection records
        List<Affectation> affectations = users.stream()
                .map(user -> {
                    Affectation affectation = new Affectation();
                    affectation.setUser(user);
                    affectation.setRequest(request);
                    return affectionRepository.save(affectation);
                })
                .collect(Collectors.toList());

        return affectations;
    }

    // Method to get all requests associated with a user
    public List<Request> getRequestsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return affectionRepository.findByUser(user).stream()
                .map(Affectation::getRequest)
                .toList();
    }

    // Method to get all users associated with a request
    public List<User> getUsersByRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        return affectionRepository.findByRequest(request).stream()
                .map(Affectation::getUser)
                .toList();
    }
}
