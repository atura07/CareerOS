package com.careeros.ats.engine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class KeywordExtractionEngine {

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "with", "for", "in", "on", "at", "to", "a", "an", "is", "are", "was", "were",
            "of", "by", "as", "or", "we", "you", "our", "your", "be", "will", "can", "from", "that",
            "this", "have", "has", "had", "not", "but", "about", "all", "also", "into", "more", "other",
            "such", "than", "then", "them", "these", "they", "their", "so", "some", "what", "which",
            "who", "would", "like", "well", "work", "join", "help", "years", "year", "looking", "candidate",
            "role", "team", "ideal", "opportunity", "company", "position", "ability", "strong", "good"
    );

    private static final Set<String> HIGH_PRIORITY_MARKERS = Set.of(
            "must have", "required", "requirements", "qualifications", "essential", "minimum qualifications",
            "proficient in", "hands-on experience", "expertise in"
    );

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractedJdKeywordsResult {
        private List<String> highPriorityKeywords;
        private List<String> mediumPriorityKeywords;
        private List<String> matchedKeywords;
        private List<String> missingKeywords;
        private double matchPercentage;
    }

    public ExtractedJdKeywordsResult extractAndMatchKeywords(String jdText, String resumeText) {
        if (jdText == null || jdText.isBlank()) {
            return ExtractedJdKeywordsResult.builder()
                    .highPriorityKeywords(Collections.emptyList())
                    .mediumPriorityKeywords(Collections.emptyList())
                    .matchedKeywords(Collections.emptyList())
                    .missingKeywords(Collections.emptyList())
                    .matchPercentage(0.0)
                    .build();
        }

        String normalizedResume = (resumeText != null ? resumeText : "").toLowerCase();
        String normalizedJd = jdText.toLowerCase();

        // 1. Extract candidate technical terms & phrases
        Set<String> highPriority = new LinkedHashSet<>();
        Set<String> mediumPriority = new LinkedHashSet<>();

        // Check for high-priority requirement sections
        for (String marker : HIGH_PRIORITY_MARKERS) {
            int idx = normalizedJd.indexOf(marker);
            if (idx != -1) {
                int endIdx = Math.min(normalizedJd.length(), idx + 350);
                String snippet = normalizedJd.substring(idx, endIdx);
                extractMeaningfulTokens(snippet).forEach(highPriority::add);
            }
        }

        // Extract overall JD meaningful tokens
        List<String> allTokens = extractMeaningfulTokens(normalizedJd);
        for (String token : allTokens) {
            if (!highPriority.contains(token)) {
                mediumPriority.add(token);
            }
        }

        // Limit lists to avoid noise
        List<String> finalHigh = highPriority.stream().limit(15).collect(Collectors.toList());
        List<String> finalMedium = mediumPriority.stream()
                .filter(t -> !finalHigh.contains(t))
                .limit(20)
                .collect(Collectors.toList());

        List<String> allTargetKeywords = new ArrayList<>(finalHigh);
        allTargetKeywords.addAll(finalMedium);

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        double weightedTotal = 0.0;
        double weightedMatched = 0.0;

        for (String kw : finalHigh) {
            weightedTotal += 2.0;
            if (isKeywordPresentInResume(kw, normalizedResume)) {
                matched.add(kw);
                weightedMatched += 2.0;
            } else {
                missing.add(kw);
            }
        }

        for (String kw : finalMedium) {
            weightedTotal += 1.0;
            if (isKeywordPresentInResume(kw, normalizedResume)) {
                matched.add(kw);
                weightedMatched += 1.0;
            } else {
                missing.add(kw);
            }
        }

        double matchPercentage = weightedTotal > 0 ? (weightedMatched / weightedTotal) * 100.0 : 0.0;

        return ExtractedJdKeywordsResult.builder()
                .highPriorityKeywords(finalHigh)
                .mediumPriorityKeywords(finalMedium)
                .matchedKeywords(matched)
                .missingKeywords(missing)
                .matchPercentage(Math.round(matchPercentage * 10.0) / 10.0)
                .build();
    }

    private List<String> extractMeaningfulTokens(String text) {
        List<String> tokens = new ArrayList<>();
        // Match 2-word key phrases e.g. "unit testing", "rest api", "cloud services"
        Pattern phrasePattern = Pattern.compile("\\b([a-z0-9#+.-]{2,15})\\s+([a-z0-9#+.-]{2,15})\\b");
        Matcher phraseMatcher = phrasePattern.matcher(text);
        while (phraseMatcher.find()) {
            String w1 = phraseMatcher.group(1);
            String w2 = phraseMatcher.group(2);
            if (!STOP_WORDS.contains(w1) && !STOP_WORDS.contains(w2)) {
                String phrase = (w1 + " " + w2).trim();
                if (phrase.length() >= 5) {
                    tokens.add(phrase);
                }
            }
        }

        // Match single words
        Pattern wordPattern = Pattern.compile("\\b([a-z0-9#+.-]{3,20})\\b");
        Matcher wordMatcher = wordPattern.matcher(text);
        while (wordMatcher.find()) {
            String word = wordMatcher.group(1);
            if (!STOP_WORDS.contains(word) && !word.matches("^\\d+$")) {
                tokens.add(word);
            }
        }

        return tokens.stream().distinct().collect(Collectors.toList());
    }

    private boolean isKeywordPresentInResume(String keyword, String normalizedResume) {
        if (normalizedResume == null || normalizedResume.isBlank()) return false;
        if (keyword.contains(" ")) {
            return normalizedResume.contains(keyword);
        }
        String regex = "\\b" + Pattern.quote(keyword) + "\\b";
        return Pattern.compile(regex).matcher(normalizedResume).find();
    }
}
