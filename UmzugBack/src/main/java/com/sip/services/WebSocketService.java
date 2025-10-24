package com.sip.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.management.Notification;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    public void sendNotificationToCarrier(Long recipientId, Notification notification) {
        String message = "Notification pour le Carrier : " + notification.getMessage();
    }
}
