package com.careeros.exception;

import lombok.Getter;

@Getter
public class EmailNotVerifiedException extends RuntimeException {

    private final String email;
    private final String errorCode = "EMAIL_NOT_VERIFIED";

    public EmailNotVerifiedException(String message, String email) {
        super(message);
        this.email = email;
    }
}
