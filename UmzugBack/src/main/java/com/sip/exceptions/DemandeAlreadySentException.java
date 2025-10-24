package com.sip.exceptions;

public class DemandeAlreadySentException extends RuntimeException {
    public DemandeAlreadySentException(String message) {
        super(message);
    }
}
