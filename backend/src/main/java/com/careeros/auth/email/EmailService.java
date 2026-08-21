package com.careeros.auth.email;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${application.mail.from:}")
    private String fromAddress;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    /**
     * Sends a 6-digit OTP verification email to the user.
     * If SMTP credentials are not yet configured in the environment,
     * logs the OTP clearly in server logs for development/testing.
     */
    public void sendVerificationOtp(String toEmail, String fullName, String otp) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();

        boolean hasUsername = mailUsername != null && !mailUsername.trim().isEmpty();
        boolean hasPassword = mailPassword != null && !mailPassword.trim().isEmpty();

        log.info("================================================================================");
        log.info("[SMTP DIAGNOSTIC] Email sending requested for: [{}]", toEmail);
        log.info("[SMTP DIAGNOSTIC] Configuration Check:");
        log.info("  - Host: [{}]", mailHost);
        log.info("  - Port: [{}]", mailPort);
        log.info("  - MAIL_USERNAME present: [{}] (Value: [{}])", hasUsername, hasUsername ? mailUsername : "EMPTY/MISSING");
        log.info("  - MAIL_PASSWORD present: [{}]", hasPassword);
        log.info("  - MAIL_FROM: [{}]", (fromAddress != null && !fromAddress.trim().isEmpty()) ? fromAddress : "(default to username)");
        log.info("  - JavaMailSender bean available: [{}]", (mailSender != null));
        log.info("================================================================================");

        if (mailSender == null || !hasUsername || !hasPassword) {
            log.error("[SMTP CONFIGURATION ERROR] Cannot send email. Missing credentials:");
            log.error("  - MAIL_USERNAME configured: {}", hasUsername);
            log.error("  - MAIL_PASSWORD configured: {}", hasPassword);
            log.error("  - Please add MAIL_USERNAME and MAIL_PASSWORD in Render Environment variables.");
            log.warn("[FALLBACK LOG] Generated OTP for [{}] ({}): [{}]", toEmail, fullName, otp);
            throw new IllegalStateException("Email delivery failed: SMTP credentials (MAIL_USERNAME / MAIL_PASSWORD) are not configured on the server.");
        }

        // Determine effective From address (Gmail requires authenticated sender email)
        String effectiveFrom = (fromAddress != null && !fromAddress.trim().isEmpty() && !fromAddress.contains("noreply@careeros.com"))
                ? fromAddress.trim()
                : mailUsername.trim();

        log.info("[SMTP SEND] Initiating SMTP connection to {}:{} from [{}] to [{}]...", mailHost, mailPort, effectiveFrom, toEmail);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(effectiveFrom, "CareerOS");
            helper.setTo(toEmail.trim());
            helper.setSubject("Your CareerOS Verification Code: " + otp);

            String htmlContent = buildOtpHtmlEmail(fullName, otp);
            String textContent = buildOtpTextEmail(fullName, otp);

            helper.setText(textContent, htmlContent);

            mailSender.send(message);
            log.info("================================================================================");
            log.info("[SMTP SUCCESS] 6-digit OTP verification email successfully delivered to [{}]", toEmail);
            log.info("================================================================================");

        } catch (Exception e) {
            log.error("================================================================================");
            log.error("[SMTP ERROR] Failed to send email to [{}]: {}", toEmail, e.getMessage());
            log.error("Exception Class: {}", e.getClass().getName());
            if (e.getCause() != null) {
                log.error("Root Cause: {} - {}", e.getCause().getClass().getName(), e.getCause().getMessage());
            }
            log.error("Troubleshooting guide for Gmail SMTP:");
            log.error("1. Ensure 2-Step Verification is ENABLED on Google Account: {}", mailUsername);
            log.error("2. Ensure MAIL_PASSWORD is a 16-character Google App Password (not standard account password).");
            log.error("3. Generate a Google App Password at: https://myaccount.google.com/apppasswords");
            log.error("OTP for [{}] ({}): [{}]", toEmail, fullName, otp);
            log.error("================================================================================", e);
            throw new RuntimeException("SMTP delivery failure: " + e.getMessage(), e);
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

