package com.careeros.application;

/**
 * Thrown when an application is not found or does not belong to the user.
 */
public class ApplicationNotFoundException extends RuntimeException {

    public ApplicationNotFoundException(String message) {
        super(message);
    }
}
