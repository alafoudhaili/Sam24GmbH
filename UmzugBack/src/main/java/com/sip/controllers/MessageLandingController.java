package com.sip.controllers;

import com.sip.entities.MessageLanding;
import com.sip.services.MessageLandingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messageLanding")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageLandingController {

    private final MessageLandingService messageLandingService;


    @GetMapping("")
    public List<MessageLanding> getAllMessageLandings() {
        return messageLandingService.getAllMessageLanding();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageLanding> getMessageLandingById(@PathVariable Long id) {
        MessageLanding messageLanding = messageLandingService.getMessageLandingById(id);
        if (messageLanding != null) {
            return ResponseEntity.ok(messageLanding);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/add")
    public ResponseEntity<MessageLanding> addMessageLanding(@RequestBody MessageLanding messageLanding) {
        messageLanding.setDate(LocalDateTime.now());
        messageLanding.setUnreadLandingCount(messageLanding.getUnreadLandingCount() + 1);
        messageLanding.setLu("non-lu");
        MessageLanding savedMessageLanding = messageLandingService.saveMessageLanding(messageLanding);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMessageLanding);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMessageLanding(@PathVariable Long id) {
        try {
            messageLandingService.deleteMessageLanding(id);
            return ResponseEntity.ok("Message Landing deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete MessageLanding");
        }
    }

    @GetMapping("/total-unread-landings")
    public ResponseEntity<?> getTotalUnreadLandingMessages() {
        try {
            Integer total = messageLandingService.getTotalUnreadLandingMessages();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve total unread landing messages due to internal server error.");
        }
    }


    @PutMapping("/reset-unread-landings")
    public ResponseEntity<?> resetUnreadComments() {
        if (messageLandingService.hasUnreadMessages()) {
            messageLandingService.resetAllUnreadLandingMessages();
            return ResponseEntity.ok("All unread messages landing counts have been reset to 0.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No unread messages landing to reset.");
        }
    }




    @PutMapping("/{id}/statut")
    public ResponseEntity<?> updateStatut(
            @PathVariable Long id
    ) {
        MessageLanding updatedMessageLanding = messageLandingService.updateStatut(id);

        if (updatedMessageLanding != null) {
            return new ResponseEntity<>(updatedMessageLanding, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}

