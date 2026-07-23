package com.careeros.resume;

/**
 * Exception thrown when resume upload validation fails.
 */
public class ResumeUploadException extends RuntimeException {

    public ResumeUploadException(String message) {
        super(message);
    }

    public ResumeUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}

