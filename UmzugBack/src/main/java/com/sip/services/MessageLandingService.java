package com.sip.services;


import com.sip.entities.MessageLanding;
import com.sip.repositories.MessageLandingRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageLandingService {


    private final MessageLandingRepository messageLandingRepository;

    public List<MessageLanding> getAllMessageLanding() {
        return messageLandingRepository.findAll();
    }

    public MessageLanding getMessageLandingById(Long id) {

        return messageLandingRepository.findById(id).orElse(null);
    }


    public MessageLanding saveMessageLanding(MessageLanding messageLanding) {
        return messageLandingRepository.save(messageLanding);
    }

    public void deleteMessageLanding(Long id) {
        if (messageLandingRepository.existsById(id)) {
            messageLandingRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("MessageLanding not found with id: " + id);
        }
    }

    public Integer getTotalUnreadLandingMessages() {
        try {
            Integer total = messageLandingRepository.sumUnreadLandingMessages();
            return (total != null) ? total : 0;
        } catch (Exception e) {
            e.printStackTrace(); // Log the stack trace for debugging
            throw new RuntimeException("Error fetching unread landing messages", e);
        }
    }

    @Transactional
    public void resetAllUnreadLandingMessages() {
        messageLandingRepository.resetAllUnreadLandingMessagesCounts();
    }

    public boolean hasUnreadMessages() {
        return messageLandingRepository.countUnreadMessages() > 0;
    }

    public int getUnreadMessagesCount() {
        return messageLandingRepository.countUnreadMessages();
    }

    public MessageLanding updateStatut(long id) {
        MessageLanding existingMessageLanding = messageLandingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MessageLanding not found with id: " + id));

        existingMessageLanding.setLu("lu");

        return messageLandingRepository.save(existingMessageLanding);
    }
}

