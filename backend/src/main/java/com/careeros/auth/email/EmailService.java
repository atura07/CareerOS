package com.careeros.auth.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for delivering transactional authentication emails (6-digit OTPs)
 * via Resend's reliable HTTP REST API.
 */
@Slf4j
@Service
public class EmailService {

    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${application.resend.api-key:${RESEND_API_KEY:}}")
    private String resendApiKey;

    @Value("${application.mail.from:${MAIL_FROM:onboarding@resend.dev}}")
    private String fromAddress;

    public EmailService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Sends a 6-digit OTP verification email to the user via Resend HTTP API.
     */
    public void sendVerificationOtp(String toEmail, String fullName, String otp) {
        boolean hasApiKey = resendApiKey != null && !resendApiKey.trim().isEmpty();

        log.info("================================================================================");
        log.info("[EMAIL API] Initiating OTP email dispatch for: [{}]", toEmail);
        log.info("[EMAIL API] Configuration Check:");
        log.info("  - Provider: Resend HTTP REST API");
        log.info("  - RESEND_API_KEY configured: [{}]", hasApiKey);
        log.info("  - MAIL_FROM configured: [{}]", fromAddress);
        log.info("================================================================================");

        if (!hasApiKey) {
            log.warn("[FALLBACK LOG] RESEND_API_KEY is not configured. Generated OTP for [{}] ({}): [{}]", toEmail, fullName, otp);
            return;
        }

        // Format sender address nicely for email clients
        String effectiveFrom = fromAddress != null && !fromAddress.trim().isEmpty()
                ? fromAddress.trim()
                : "onboarding@resend.dev";

        if (!effectiveFrom.contains("<") && !effectiveFrom.contains(">")) {
            effectiveFrom = "CareerOS <" + effectiveFrom + ">";
        }

        String subject = "Your CareerOS Verification Code: " + otp;
        String htmlContent = buildOtpHtmlEmail(fullName, otp);
        String textContent = buildOtpTextEmail(fullName, otp);

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("from", effectiveFrom);
            payload.put("to", Collections.singletonList(toEmail.trim()));
            payload.put("subject", subject);
            payload.put("html", htmlContent);
            payload.put("text", textContent);

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            log.info("[EMAIL API] Sending POST request to Resend API for [{}] from [{}]...", toEmail, effectiveFrom);

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("================================================================================");
                log.info("[EMAIL SUCCESS] OTP verification email successfully delivered via Resend!");
                log.info("  - Recipient: [{}]", toEmail);
                log.info("  - Status Code: [{}]", response.statusCode());
                log.info("  - Resend Response: [{}]", response.body());
                log.info("================================================================================");
            } else {
                log.warn("================================================================================");
                log.warn("[EMAIL NOTICE] Resend API returned HTTP {}: {}", response.statusCode(), response.body());
                log.warn("  - Recipient: [{}]", toEmail);
                log.warn("[FALLBACK LOG] Generated OTP for [{}] ({}): [{}]", toEmail, fullName, otp);
                log.warn("================================================================================");
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("[EMAIL FAILURE] Email dispatch interrupted for [{}]: {}", toEmail, e.getMessage(), e);
        } catch (Exception e) {
            log.warn("================================================================================");
            log.warn("[EMAIL NOTICE] Exception communicating with Resend for [{}]: {}", toEmail, e.getMessage());
            log.warn("[FALLBACK LOG] Generated OTP for [{}] ({}): [{}]", toEmail, fullName, otp);
            log.warn("================================================================================");
        }
    }

    private String buildOtpTextEmail(String fullName, String otp) {
        return "Hello " + (fullName != null && !fullName.isEmpty() ? fullName : "there") + ",\n\n" +
                "Your CareerOS verification code is:\n\n" +
                otp + "\n\n" +
                "This code expires in 10 minutes.\n\n" +
                "If you did not request this verification, please ignore this email.\n\n" +
                "— CareerOS Team";
    }

    private String buildOtpHtmlEmail(String fullName, String otp) {
        String name = (fullName != null && !fullName.isEmpty()) ? fullName : "there";
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='utf-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "</head>" +
                "<body style='margin:0;padding:0;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;color:#e2e8f0;'>" +
                "<table width='100%' border='0' cellspacing='0' cellpadding='0' style='background-color:#090d16;padding:40px 20px;'>" +
                "<tr>" +
                "<td align='center'>" +
                "<table width='100%' border='0' cellspacing='0' cellpadding='0' style='max-width:520px;background-color:#0f172a;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;text-align:left;'>" +
                "<tr>" +
                "<td style='padding-bottom:24px;'>" +
                "<span style='font-size:22px;font-weight:700;letter-spacing:-0.5px;color:#38bdf8;'>Career<span style='color:#ffffff;'>OS</span></span>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='font-size:16px;line-height:24px;color:#cbd5e1;padding-bottom:16px;'>" +
                "Hello <strong style='color:#ffffff;'>" + name + "</strong>," +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='font-size:15px;line-height:22px;color:#94a3b8;padding-bottom:28px;'>" +
                "Please use the following 6-digit verification code to complete your CareerOS verification:" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td align='center' style='padding-bottom:28px;'>" +
                "<div style='display:inline-block;background-color:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.25);border-radius:12px;padding:16px 32px;letter-spacing:8px;font-size:32px;font-weight:700;font-family:monospace;color:#38bdf8;'>" +
                otp +
                "</div>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='font-size:13px;line-height:20px;color:#64748b;padding-bottom:24px;'>" +
                "This code will expire in <strong style='color:#94a3b8;'>10 minutes</strong>. If you did not request this verification, you can safely ignore this email." +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;font-size:12px;color:#475569;'>" +
                "CareerOS &bull; AI-Powered Placement & Career Platform" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</body>" +
                "</html>";
    }
}
