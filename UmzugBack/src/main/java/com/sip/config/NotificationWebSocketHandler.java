package com.sip.config;

import org.springframework.web.socket.*;

public class NotificationWebSocketHandler implements WebSocketHandler {

    // Une méthode pour envoyer des notifications aux clients connectés
    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        // Exemple de message envoyé aux clients, tu peux adapter le contenu du message.
        session.sendMessage(new TextMessage("New request received!"));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Optionnel : logique lorsque la connexion est établie
        System.out.println("New WebSocket connection established.");
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        // Gestion des erreurs de transport
        System.out.println("Error occurred: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Optionnel : logique lorsque la connexion est fermée
        System.out.println("WebSocket connection closed.");
    }

    @Override
    public boolean supportsPartialMessages() {
        return false; // On n'utilise pas de messages partiels ici
    }
}