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

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
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
    public List<Request> getWeeklyRequestsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        LocalDateTime[] weekRange = getWeekRange();
        LocalDateTime startOfWeek = weekRange[0];
        LocalDateTime endOfWeek = weekRange[1];

        return affectionRepository.findByUser(user).stream()
                .map(Affectation::getRequest)
                .filter(request -> {
                    LocalDateTime umzugDate = request.getUmzugdate();
                    return umzugDate != null &&
                            !umzugDate.isBefore(startOfWeek) &&
                            !umzugDate.isAfter(endOfWeek);
                })
                .sorted(Comparator.comparing(Request::getUmzugdate))
                .toList();
    }
    /**
     * Get the week range based on current day and time.
     * If it's Sunday after 12:00, return next week's range.
     * Otherwise, return current week's range (Monday to Sunday).
     */
    private LocalDateTime[] getWeekRange() {
        LocalDateTime now = LocalDateTime.now();
        DayOfWeek currentDay = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        LocalDateTime startOfWeek;

        // If it's Sunday (day 7) and after 12:00 (noon)
        if (currentDay == DayOfWeek.SUNDAY && currentTime.isAfter(LocalTime.NOON)) {
            // Show next week (starting from tomorrow which is Monday)
            startOfWeek = now.plusDays(1).with(LocalTime.MIN);
        } else {
            // Show current week (find the most recent Monday)
            int daysToSubtract = currentDay.getValue() - 1; // Monday is 1
            startOfWeek = now.minusDays(daysToSubtract).with(LocalTime.MIN);
        }

        // End of week is Sunday at 23:59:59
        LocalDateTime endOfWeek = startOfWeek.plusDays(6).with(LocalTime.MAX);

        return new LocalDateTime[]{startOfWeek, endOfWeek};
    }
}
