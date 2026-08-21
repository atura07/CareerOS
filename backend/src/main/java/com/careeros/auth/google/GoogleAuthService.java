package com.careeros.auth.google;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class GoogleAuthService {

    @Value("${google.client-id:${GOOGLE_CLIENT_ID:}}")
    private String googleClientId;


    public GoogleUserInfo verifyToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier.Builder verifierBuilder = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            );

            if (googleClientId != null && !googleClientId.trim().isEmpty()) {
                verifierBuilder.setAudience(Collections.singletonList(googleClientId.trim()));
            }

            GoogleIdTokenVerifier verifier = verifierBuilder.build();
            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");

            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Google account has no associated email address");
            }

            return GoogleUserInfo.builder()
                    .email(email.trim().toLowerCase())
                    .fullName(name != null && !name.trim().isEmpty() ? name : email.split("@")[0])
                    .emailVerified(emailVerified)
                    .pictureUrl(pictureUrl)
                    .build();

        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to verify Google ID token: {}", e.getMessage());
            throw new IllegalArgumentException("Google authentication failed. Please try again.");
        }
    }
}
