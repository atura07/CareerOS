package com.careeros.ats.service;

import com.careeros.ats.dto.AtsDetailedResponseDto;
import com.careeros.openai.OpenAIClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtsAiSuggestionService {

    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;

    public List<String> generateContextualSuggestions(
            int overallScore,
            Integer jobMatchScore,
            List<String> matchedSkills,
            List<String> missingSkills,
            List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown,
            List<String> defaultSuggestions) {

        if (defaultSuggestions == null) {
            defaultSuggestions = new ArrayList<>();
        }

        try {
            String systemPrompt = """
                You are a senior technical recruiter and ATS specialist.
                Provide 3 to 4 actionable, highly specific improvement suggestions to help the candidate optimize their resume for applicant tracking systems and hiring managers.
                Rules:
                - Do NOT invent or claim skills the candidate does not have.
                - Focus on measurable impact (metrics, action verbs, scope), formatting, and bridging missing keywords if applicable.
                - Return valid JSON matching: {"suggestions": ["...", "...", "..."]}
                """;

            String userContent = String.format(
                    "Overall Score: %d/100, Job Match Score: %s\nMatched Skills: %s\nMissing Skills: %s\nCategory Breakdown: %s",
                    overallScore,
                    jobMatchScore != null ? jobMatchScore + "/100" : "N/A",
                    matchedSkills != null ? String.join(", ", matchedSkills) : "None",
                    missingSkills != null ? String.join(", ", missingSkills) : "None",
                    breakdown != null ? breakdown.toString() : "None"
            );

            List<Map<String, String>> messages = List.of(Map.of("role", "user", "content", userContent));

            String jsonResponse = openAIClient.executeChatCompletion(systemPrompt, messages, 0.4);
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode arrayNode = root.path("suggestions");
            if (arrayNode.isArray() && !arrayNode.isEmpty()) {
                List<String> aiSuggestions = new ArrayList<>();
                for (JsonNode item : arrayNode) {
                    if (!item.asText().isBlank()) {
                        aiSuggestions.add(item.asText().trim());
                    }
                }
                if (!aiSuggestions.isEmpty()) {
                    log.info("[ATS-AI] Successfully generated {} contextual suggestions", aiSuggestions.size());
                    return aiSuggestions;
                }
            }
        } catch (Exception e) {
            log.debug("[ATS-AI] OpenAI suggestion generation bypassed: {}", e.getMessage());
        }

        // Deterministic Fallback
        return defaultSuggestions;
    }
}
