package com.careeros.ats.engine;

import com.careeros.ats.dto.BulletImprovementRequestDto;
import com.careeros.ats.dto.BulletImprovementResponseDto;
import com.careeros.openai.OpenAIClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Interactive Resume Bullet Improver Engine.
 * Enhances action verbs, structure, and technical clarity without fabricating metrics or false facts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BulletImprovementEngine {

    private final OpenAIClient openAIClient;
    private final ObjectMapper objectMapper;

    public BulletImprovementResponseDto improveBullet(BulletImprovementRequestDto request) {
        if (request == null || request.getOriginalBullet() == null || request.getOriginalBullet().trim().isBlank()) {
            throw new IllegalArgumentException("Original bullet point text is required.");
        }

        String rawBullet = request.getOriginalBullet().trim();
        String targetRole = request.getTargetRole() != null ? request.getTargetRole() : "Software Engineer";
        String contextTech = request.getContextTech() != null ? request.getContextTech() : "";

        // Try AI enhancement first
        try {
            String prompt = """
                    You are an expert technical resume editor.
                    Improve the following resume bullet point for a %s role.

                    CRITICAL RULES:
                    1. Preserve the user's actual work and facts.
                    2. NEVER invent fake metrics, user counts, percentages, or false company achievements.
                    3. Use a strong opening engineering action verb (e.g., Architected, Engineered, Developed, Optimized, Integrated, Automated).
                    4. Follow the structural formula: [Action Verb] + [Specific Feature/System] + [Technologies Used] + [Outcome/Purpose].
                    5. If metric is missing, use clear bracketed placeholders like [reduced latency by X%%] or [supported Y concurrent users].

                    Original Bullet: "%s"
                    Context Technologies: "%s"

                    Return ONLY a JSON object with this exact schema:
                    {
                      "improvedBullet": "Engineered RESTful microservices for user management using Spring Boot and PostgreSQL, [improving response latency by X%%].",
                      "alternativeVariations": [
                        "Architected scalable backend APIs with Spring Boot and PostgreSQL to streamline user transactions, [handling Y concurrent requests].",
                        "Developed and deployed robust backend microservices utilizing Spring Boot, optimizing database queries for high throughput."
                      ],
                      "actionVerbUsed": "Engineered",
                      "feedback": "Upgraded passive phrasing to a dynamic action verb and structured the technical stack with clear architectural scope.",
                      "metricsPlaceholderPrompts": [
                        "Did this reduce response times or API latency? (e.g. reduced latency by 30%%)",
                        "What was the scale or throughput handled? (e.g. supporting 50k+ daily users)",
                        "Did this improve test coverage or deployment cycle time?"
                      ]
                    }
                    """.formatted(targetRole, rawBullet, contextTech);

            String responseJson = openAIClient.executeChatCompletion(
                    "You are a strict, factual technical resume editor. Never hallucinate metrics. Always output valid JSON.",
                    List.of(Map.of("role", "user", "content", prompt)),
                    0.3
            );

            JsonNode root = objectMapper.readTree(cleanJsonResponse(responseJson));
            String improvedBullet = root.path("improvedBullet").asText();
            String actionVerb = root.path("actionVerbUsed").asText("Developed");
            String feedback = root.path("feedback").asText("Refined phrasing with strong action verb and structural formula.");

            List<String> variations = new ArrayList<>();
            if (root.has("alternativeVariations")) {
                for (JsonNode n : root.path("alternativeVariations")) {
                    variations.add(n.asText());
                }
            }

            List<String> prompts = new ArrayList<>();
            if (root.has("metricsPlaceholderPrompts")) {
                for (JsonNode n : root.path("metricsPlaceholderPrompts")) {
                    prompts.add(n.asText());
                }
            }

            return BulletImprovementResponseDto.builder()
                    .originalBullet(rawBullet)
                    .improvedBullet(improvedBullet)
                    .alternativeVariations(variations)
                    .actionVerbUsed(actionVerb)
                    .impactFormula("[Action Verb] + [Technical Component] + [Tech Stack] + [Measurable Outcome / Goal]")
                    .metricsPlaceholderPrompts(prompts)
                    .feedback(feedback)
                    .build();

        } catch (Exception e) {
            log.warn("[BulletImprover] OpenAI enhancement unavailable, falling back to deterministic rule-based improver: {}", e.getMessage());
            return buildDeterministicFallback(rawBullet, contextTech);
        }
    }

    private BulletImprovementResponseDto buildDeterministicFallback(String rawBullet, String contextTech) {
        String clean = rawBullet.replaceAll("^(worked on|helped with|responsible for|did|made)\\s+", "").trim();
        String techSuffix = !contextTech.isBlank() ? " using " + contextTech : "";

        String improved = "Engineered " + clean + techSuffix + ", [improving system efficiency and performance].";
        String alt1 = "Architected and implemented " + clean + techSuffix + " to streamline backend operations.";
        String alt2 = "Developed robust solutions for " + clean + techSuffix + ", ensuring scalability and reliability.";

        return BulletImprovementResponseDto.builder()
                .originalBullet(rawBullet)
                .improvedBullet(improved)
                .alternativeVariations(List.of(alt1, alt2))
                .actionVerbUsed("Engineered")
                .impactFormula("[Action Verb] + [Feature / Responsibility] + [Tech Stack] + [Measurable Outcome]")
                .metricsPlaceholderPrompts(List.of(
                        "What was the scale or number of users impacted? (e.g. supporting 10,000+ daily active users)",
                        "What percentage latency reduction or time saved was achieved? (e.g. reducing query latency by 35%)",
                        "What was the business or engineering outcome?"
                ))
                .feedback("Replaced passive phrasing with active engineering leadership verbs. Add your real metrics in the bracketed placeholders.")
                .build();
    }

    private String cleanJsonResponse(String raw) {
        String clean = raw.trim();
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        return clean.trim();
    }
}
