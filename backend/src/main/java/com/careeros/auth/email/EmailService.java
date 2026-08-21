package com.careeros.auth.email;

import jakarta.mail.MessagingException;
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

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${application.mail.from:noreply@careeros.com}")
    private String fromAddress;

    public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    /**
     * Sends a 6-digit OTP verification email to the user.
     * If SMTP credentials are not configured, logs the OTP safely for local development.
     */
    public void sendVerificationOtp(String toEmail, String fullName, String otp) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();

        if (mailSender == null || mailUsername == null || mailUsername.trim().isEmpty()) {
            log.warn("================================================================");
            log.warn("SMTP NOT CONFIGURED (Set MAIL_USERNAME and MAIL_PASSWORD)");
            log.warn("Verification OTP for [{}] ({}): [{}]", toEmail, fullName, otp);
            log.warn("Expires in 10 minutes.");
            log.warn("================================================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromAddress, "CareerOS");
            helper.setTo(toEmail);
            helper.setSubject("Verify your CareerOS account");

            String htmlContent = buildOtpHtmlEmail(fullName, otp);
            String textContent = buildOtpTextEmail(fullName, otp);

            helper.setText(textContent, htmlContent);

            mailSender.send(message);
            log.info("Verification email sent successfully to {}", toEmail);

        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send verification email. Please try again later.", e);
        }
    }

    private String buildOtpTextEmail(String fullName, String otp) {
        return "Hello " + (fullName != null && !fullName.isEmpty() ? fullName : "there") + ",\n\n" +
                "Your CareerOS verification code is:\n\n" +
                otp + "\n\n" +
                "This code expires in 10 minutes.\n\n" +
                "If you did not create this account, please ignore this email.\n\n" +
                "CareerOS Team";
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
                "Thank you for signing up for CareerOS. Please use the following 6-digit verification code to complete your registration:" +
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
