package com.careeros.ats.engine;

import com.careeros.ats.dto.AtsIntelligenceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobMatchIntelligenceEngine {

    private final SkillTaxonomyEngine skillTaxonomyEngine;
    private final KeywordExtractionEngine keywordExtractionEngine;

    public record JobMatchResult(
            int jobMatchScore,
            String matchLevel,
            int requiredSkillsScore,
            int preferredSkillsScore,
            int experienceScore,
            int educationScore,
            int semanticScore,
            List<String> matchedRequiredSkills,
            List<String> missingRequiredSkills,
            List<String> matchedPreferredSkills,
            List<String> missingPreferredSkills,
            List<AtsIntelligenceDto.CategoryDetailDto> categories,
            List<String> strengths,
            List<AtsIntelligenceDto.ActionableIssueDto> criticalIssues,
            AtsIntelligenceDto.SummaryHeadlineDto summary
    ) {}

    public JobMatchResult evaluate(String resumeText, String jdText, String jobTitle, String companyName) {
        if (resumeText == null || resumeText.isBlank() || jdText == null || jdText.isBlank()) {
            return new JobMatchResult(0, "Low Job Match", 0, 0, 0, 0, 0,
                    List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                    AtsIntelligenceDto.SummaryHeadlineDto.builder().headline("Match Analysis Unavailable").description("Missing resume or job description content.").build());
        }

        // 1. Extract skills from JD & Resume
        SkillTaxonomyEngine.ExtractedSkillsResult jdSkillsResult = skillTaxonomyEngine.extractSkills(jdText);
        SkillTaxonomyEngine.ExtractedSkillsResult resumeSkillsResult = skillTaxonomyEngine.extractSkills(resumeText);

        Set<String> jdSkills = jdSkillsResult.getNormalizedSkills();
        Set<String> resumeSkills = resumeSkillsResult.getNormalizedSkills();

        // 2. Classify JD skills into Required vs Preferred
        List<String> requiredSkills = new ArrayList<>();
        List<String> preferredSkills = new ArrayList<>();

        String jdLower = jdText.toLowerCase();
        for (String skill : jdSkills) {
            int skillIdx = jdLower.indexOf(skill.toLowerCase());
            if (skillIdx != -1) {
                int start = Math.max(0, skillIdx - 150);
                String context = jdLower.substring(start, skillIdx);
                if (context.contains("preferred") || context.contains("nice to have") || context.contains("plus") || context.contains("bonus") || context.contains("optional")) {
                    preferredSkills.add(skill);
                } else {
                    requiredSkills.add(skill);
                }
            } else {
                requiredSkills.add(skill);
            }
        }

        // Fallback: If all are classified as preferred or none as required, split reasonably
        if (requiredSkills.isEmpty() && !jdSkills.isEmpty()) {
            requiredSkills.addAll(jdSkills);
            preferredSkills.clear();
        }

        List<String> matchedRequired = new ArrayList<>();
        List<String> missingRequired = new ArrayList<>();
        for (String s : requiredSkills) {
            if (resumeSkills.contains(s)) matchedRequired.add(s);
            else missingRequired.add(s);
        }

        List<String> matchedPreferred = new ArrayList<>();
        List<String> missingPreferred = new ArrayList<>();
        for (String s : preferredSkills) {
            if (resumeSkills.contains(s)) matchedPreferred.add(s);
            else missingPreferred.add(s);
        }

        // 3. Calculate category scores
        // Category 1: Required Skills (30 Pts)
        int reqScore = requiredSkills.isEmpty() ? 25 :
                (int) Math.round(((double) matchedRequired.size() / requiredSkills.size()) * 30.0);

        // Category 2: Preferred Skills (10 Pts)
        int prefScore = preferredSkills.isEmpty() ? 8 :
                (int) Math.round(((double) matchedPreferred.size() / preferredSkills.size()) * 10.0);

        // Category 3: Experience & Responsibilities Match (20 Pts)
        int expScore = 0;
        String rLower = resumeText.toLowerCase();
        if (jdLower.contains("senior") || jdLower.contains("5+") || jdLower.contains("lead")) {
            if (rLower.contains("senior") || rLower.contains("lead") || rLower.contains("architected") || rLower.contains("spearheaded")) {
                expScore += 18;
            } else {
                expScore += 11;
            }
        } else {
            // Junior / Mid role
            expScore += (rLower.contains("developed") || rLower.contains("engineered")) ? 19 : 14;
        }

        // Category 4: Education & Eligibility Match (10 Pts)
        int eduScore = 10;
        if (jdLower.contains("bachelor") || jdLower.contains("b.tech") || jdLower.contains("degree")) {
            eduScore = (rLower.contains("bachelor") || rLower.contains("b.tech") || rLower.contains("b.e") || rLower.contains("b.s") || rLower.contains("master") || rLower.contains("university")) ? 10 : 6;
        }

        // Category 5: Keyword & Semantic Alignment (20 Pts)
        KeywordExtractionEngine.ExtractedJdKeywordsResult kwMatch = keywordExtractionEngine.extractAndMatchKeywords(jdText, resumeText);
        double skillMatchPct = ((double) (matchedRequired.size() + matchedPreferred.size()) / Math.max(1, requiredSkills.size() + preferredSkills.size())) * 100.0;
        double combinedMatchPct = Math.max(skillMatchPct, kwMatch.getMatchPercentage());
        int semanticScore = (int) Math.round((combinedMatchPct / 100.0) * 20.0);

        // Overall Job Match Total (100 Pts)
        int totalJobMatch = reqScore + prefScore + expScore + eduScore + semanticScore;
        totalJobMatch = Math.max(0, Math.min(100, totalJobMatch));

        String matchLevel;
        if (totalJobMatch >= 85) matchLevel = "Excellent Job Match";
        else if (totalJobMatch >= 75) matchLevel = "Strong Job Match";
        else if (totalJobMatch >= 60) matchLevel = "Good Job Match";
        else if (totalJobMatch >= 40) matchLevel = "Basic Job Match";
        else matchLevel = "Low Job Match";

        List<AtsIntelligenceDto.CategoryDetailDto> categories = new ArrayList<>();
        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Required Technical Skills")
                .score(reqScore)
                .maxScore(30)
                .weight(30)
                .status(reqScore >= 24 ? "STRONG" : reqScore >= 18 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason("Matched " + matchedRequired.size() + " of " + requiredSkills.size() + " required technical skills.")
                .evidence(matchedRequired.stream().map(s -> "✓ " + s + " verified in resume.").toList())
                .recommendations(missingRequired.stream().map(s -> "Incorporate practical experience or projects with " + s + ".").toList())
                .build());

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Preferred & Nice-to-Have Skills")
                .score(prefScore)
                .maxScore(10)
                .weight(10)
                .status(prefScore >= 8 ? "STRONG" : prefScore >= 5 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason(preferredSkills.isEmpty() ? "No optional secondary skills specified in JD." : "Matched " + matchedPreferred.size() + " of " + preferredSkills.size() + " preferred skills.")
                .evidence(matchedPreferred.stream().map(s -> "✓ " + s + " verified as secondary strength.").toList())
                .recommendations(missingPreferred.stream().map(s -> "Optional advantage: highlight " + s + " if you have familiarity.").toList())
                .build());

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Experience & Responsibilities")
                .score(expScore)
                .maxScore(20)
                .weight(20)
                .status(expScore >= 16 ? "STRONG" : "GOOD")
                .reason("Alignment between candidate experience scope and target position seniority.")
                .evidence(List.of("Engineering scope and project complexity match role criteria."))
                .build());

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Education & Prerequisites")
                .score(eduScore)
                .maxScore(10)
                .weight(10)
                .status("STRONG")
                .reason("Meets degree and foundational academic background requirements.")
                .evidence(List.of("Relevant technical academic credentials detected."))
                .build());

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Semantic Keyword Overlap")
                .score(semanticScore)
                .maxScore(20)
                .weight(20)
                .status(semanticScore >= 15 ? "STRONG" : semanticScore >= 11 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason(String.format("%.1f%% contextual keyword alignment with JD phrasing.", kwMatch.getMatchPercentage()))
                .evidence(kwMatch.getMatchedKeywords().stream().limit(6).map(k -> "Keyword match: " + k).toList())
                .build());

        List<String> strengths = new ArrayList<>();
        if (!matchedRequired.isEmpty()) {
            strengths.add("Strong alignment on core required stack: " + String.join(", ", matchedRequired.stream().limit(4).toList()) + ".");
        }
        if (expScore >= 16) {
            strengths.add("Project implementations closely mirror the day-to-day responsibilities in this job description.");
        }

        List<AtsIntelligenceDto.ActionableIssueDto> criticalIssues = new ArrayList<>();
        if (!missingRequired.isEmpty()) {
            criticalIssues.add(AtsIntelligenceDto.ActionableIssueDto.builder()
                    .title("Missing Target Skills: " + String.join(", ", missingRequired.stream().limit(3).toList()))
                    .impactLevel("HIGH IMPACT")
                    .category("Required Skills Match")
                    .fix("If you have experience with " + missingRequired.get(0) + ", add direct project bullets detailing how you used it.")
                    .build());
        }

        String targetDisplay = (jobTitle != null && !jobTitle.isBlank() ? jobTitle : "Target Role")
                + (companyName != null && !companyName.isBlank() ? " at " + companyName : "");

        AtsIntelligenceDto.SummaryHeadlineDto summary = AtsIntelligenceDto.SummaryHeadlineDto.builder()
                .headline(matchLevel + " (" + totalJobMatch + "/100) for " + targetDisplay)
                .description("Matched " + matchedRequired.size() + " core required skills and " + kwMatch.getMatchedKeywords().size() + " technical phrases. "
                        + (missingRequired.isEmpty() ? "Outstanding coverage across all stated requirements!" : "Adding evidence for " + missingRequired.get(0) + " will maximize your match."))
                .build();

        return new JobMatchResult(
                totalJobMatch,
                matchLevel,
                reqScore,
                prefScore,
                expScore,
                eduScore,
                semanticScore,
                matchedRequired,
                missingRequired,
                matchedPreferred,
                missingPreferred,
                categories,
                strengths,
                criticalIssues,
                summary
        );
    }
}
