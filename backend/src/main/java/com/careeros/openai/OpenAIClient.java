package com.careeros.openai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OpenAIClient {

    private final OpenAIProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    /**
     * Executes a chat completion request to OpenAI with JSON object response enforcement.
     *
     * @param systemPrompt Instructions defining AI interviewer behavior and output format.
     * @param messages     List of conversation messages with "role" ("user"|"assistant") and "content".
     * @param temperature  Sampling temperature (e.g. 0.7 for conversational realism).
     * @return Raw JSON string response from OpenAI assistant content.
     */
    public String executeChatCompletion(String systemPrompt, List<Map<String, String>> messages, double temperature) {
        String apiKey = properties.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.error("[OpenAI] Missing OPENAI_API_KEY environment variable.");
            throw new IllegalStateException("OpenAI API key is not configured. Please configure OPENAI_API_KEY on the backend server.");
        }

        try {
            List<Map<String, String>> fullMessages = new java.util.ArrayList<>();
            if (systemPrompt != null && !systemPrompt.isBlank()) {
                fullMessages.add(Map.of("role", "system", "content", systemPrompt));
            }
            fullMessages.addAll(messages);

            Map<String, Object> requestBodyMap = new HashMap<>();
            requestBodyMap.put("model", properties.getModel());
            requestBodyMap.put("messages", fullMessages);
            requestBodyMap.put("temperature", temperature);
            requestBodyMap.put("response_format", Map.of("type", "json_object"));

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(properties.getBaseUrl() + "/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey.trim())
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(properties.getTimeoutSeconds()))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            log.info("[OpenAI] Sending request to model={} with {} message(s)", properties.getModel(), fullMessages.size());

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            int status = response.statusCode();
            String responseBody = response.body();

            if (status == 200) {
                JsonNode rootNode = objectMapper.readTree(responseBody);
                JsonNode choices = rootNode.path("choices");
                if (choices.isArray() && !choices.isEmpty()) {
                    String content = choices.get(0).path("message").path("content").asText();
                    return content;
                }
                throw new IllegalStateException("OpenAI returned 200 OK but response contained no choices/content: " + responseBody);
            }

            // Handle OpenAI error responses
            log.error("[OpenAI] API returned HTTP error code {}: {}", status, responseBody);
            if (status == 401) {
                throw new IllegalStateException("Invalid OpenAI API Key. Please verify OPENAI_API_KEY configuration.");
            } else if (status == 429) {
                throw new IllegalStateException("OpenAI rate limit or quota exceeded. Please check your OpenAI account billing/usage.");
            } else if (status >= 500) {
                throw new IllegalStateException("OpenAI service temporarily unavailable (HTTP " + status + "). Please try again.");
            } else {
                throw new IllegalStateException("OpenAI API error (HTTP " + status + "): " + extractErrorMessage(responseBody));
            }

        } catch (IOException | InterruptedException e) {
            log.error("[OpenAI] Network communication failure: {}", e.getMessage());
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to communicate with OpenAI API: " + e.getMessage(), e);
        }
    }

    private String extractErrorMessage(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode errorNode = root.path("error");
            if (!errorNode.isMissingNode() && errorNode.has("message")) {
                return errorNode.get("message").asText();
            }
        } catch (Exception ignored) {}
        return body;
    }
}
