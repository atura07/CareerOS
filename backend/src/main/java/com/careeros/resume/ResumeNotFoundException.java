package com.careeros.resume;

/**
 * Exception thrown when a requested resume is not found.
 */
public class ResumeNotFoundException extends RuntimeException {

    public ResumeNotFoundException(String message) {
        super(message);
    }
}

