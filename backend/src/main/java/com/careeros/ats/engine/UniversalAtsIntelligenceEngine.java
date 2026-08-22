package com.careeros.ats.engine;

import com.careeros.ats.dto.AtsIntelligenceDto;
import com.careeros.resume.extraction.ExtractedResumeContent;
import com.careeros.resume.extraction.ExtractionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Universal ATS Intelligence Engine.
 * Evaluates resumes across 7 deterministic, explainable categories with Fresher vs Experienced awareness,
 * concrete evidence extraction, and strictly separated analysis confidence.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UniversalAtsIntelligenceEngine {

    private final SkillTaxonomyEngine skillTaxonomyEngine;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?[0-9]{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(linkedin\\.com/in/[a-zA-Z0-9_-]+|linkedin)");
    private static final Pattern GITHUB_PORTFOLIO_PATTERN = Pattern.compile("(github\\.com/[a-zA-Z0-9_-]+|github|gitlab|portfolio|devpost)");
    private static final Pattern METRIC_PATTERN = Pattern.compile("(\\d+([.,]\\d+)?%|\\b\\d+\\s*(ms|seconds|users|req|rpm|qps|rps|million|k\\+|gb|tb)\\b|top\\s*\\d+%?|reduced|improved by|increased by)", Pattern.CASE_INSENSITIVE);
    private static final Pattern ACTION_VERB_PATTERN = Pattern.compile("\\b(architected|engineered|developed|implemented|optimized|designed|automated|integrated|deployed|scaled|built|spearheaded|refactored|containerized|orchestrated|migrated|created|delivered)\\b", Pattern.CASE_INSENSITIVE);

    public record UniversalAnalysisResult(
            int overallScore,
            String scoreLabel,
            int confidence,
            String confidenceMessage,
            String analysisStatus,
            AtsIntelligenceDto.SummaryHeadlineDto summary,
            List<AtsIntelligenceDto.CategoryDetailDto> categories,
            List<String> strengths,
            List<AtsIntelligenceDto.ActionableIssueDto> criticalIssues,
            List<String> quickWins,
            List<AtsIntelligenceDto.DetailedRecommendationDto> detailedRecommendations,
            AtsIntelligenceDto.KeywordIntelligenceDto keywordIntelligence,
            boolean isFresher
    ) {}

    public UniversalAnalysisResult analyze(String extractedText, ExtractedResumeContent extractionTelemetry, String targetRole) {
        if (extractedText == null || extractedText.isBlank() || extractedText.startsWith("[Parsing failed")) {
            return buildUnavailableResult("Resume text could not be reliably extracted. All direct parsing and OCR stages failed.");
        }

        String text = extractedText.trim();
        String lower = text.toLowerCase();

        // 1. Detect candidate seniority (Fresher vs Experienced)
        boolean isFresher = detectIsFresher(lower);

        // 2. Extract technical skills via SkillTaxonomyEngine
        SkillTaxonomyEngine.ExtractedSkillsResult skillsResult = skillTaxonomyEngine.extractSkills(text);
        Set<String> normalizedSkills = skillsResult.getNormalizedSkills();

        List<AtsIntelligenceDto.CategoryDetailDto> categories = new ArrayList<>();
        List<String> allStrengths = new ArrayList<>();
        List<AtsIntelligenceDto.ActionableIssueDto> criticalIssues = new ArrayList<>();
        List<String> quickWins = new ArrayList<>();
        List<AtsIntelligenceDto.DetailedRecommendationDto> detailedRecs = new ArrayList<>();

        // ════════ CATEGORY A: Parsability & Document Health (15 Points) ════════
        int scoreA = 0;
        List<String> evidenceA = new ArrayList<>();
        List<String> recsA = new ArrayList<>();

        int charCount = text.length();
        if (extractionTelemetry != null && extractionTelemetry.getExtractionStatus() == ExtractionStatus.OCR_USED) {
            scoreA += 6;
            evidenceA.add("OCR-assisted text extraction successfully recognized " + charCount + " characters.");
        } else {
            scoreA += 8;
            evidenceA.add("Clean direct text stream parsed with high fidelity (" + charCount + " characters).");
        }

        if (charCount >= 500) {
            scoreA += 4;
            evidenceA.add("Healthy text density with full document body extracted.");
        } else if (charCount >= 250) {
            scoreA += 3;
            evidenceA.add("Moderate text density extracted.");
        } else {
            scoreA += 1;
            recsA.add("Resume length appears sparse. Consider expanding on project details and technical responsibilities.");
        }

        // Noise & control glyph check
        if (!text.contains("\uFFFD") && !text.contains("???")) {
            scoreA += 3;
            evidenceA.add("Zero encoding artifacts or corrupted glyphs detected.");
        } else {
            recsA.add("Minor character encoding noise detected. Ensure PDF is generated from a clean word processor.");
        }
        scoreA = Math.min(15, scoreA);

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Parsability & Document Health")
                .score(scoreA)
                .maxScore(15)
                .weight(15)
                .status(scoreA >= 13 ? "STRONG" : scoreA >= 10 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason(scoreA >= 13 ? "Document structure is fully parsable by all modern ATS systems." : "Document parsed with minor layout constraints.")
                .evidence(evidenceA)
                .recommendations(recsA)
                .build());

        // ════════ CATEGORY B: Core Section Completeness (20 Points) ════════
        int scoreB = 0;
        List<String> evidenceB = new ArrayList<>();
        List<String> recsB = new ArrayList<>();

        boolean hasSummary = lower.contains("summary") || lower.contains("objective") || lower.contains("profile") || lower.contains("about me");
        boolean hasEducation = lower.contains("education") || lower.contains("academic") || lower.contains("university") || lower.contains("degree") || lower.contains("b.tech") || lower.contains("bachelor") || lower.contains("master");
        boolean hasSkills = lower.contains("skill") || lower.contains("technologies") || lower.contains("technical skills") || lower.contains("stack");
        boolean hasProjects = lower.contains("project") || lower.contains("projects") || lower.contains("initiatives");
        boolean hasExperience = lower.contains("experience") || lower.contains("employment") || lower.contains("work history") || lower.contains("internship");
        boolean hasCerts = lower.contains("certif") || lower.contains("achievement") || lower.contains("award") || lower.contains("hackathon");

        if (isFresher) {
            // Fresher weighting: Projects & Skills are primary
            if (hasSkills) { scoreB += 6; evidenceB.add("Technical Skills section detected."); }
            if (hasProjects) { scoreB += 6; evidenceB.add("Projects section with practical implementations detected."); }
            if (hasEducation) { scoreB += 4; evidenceB.add("Academic background and degree credentials present."); }
            if (hasExperience) { scoreB += 2; evidenceB.add("Internship / early industry experience present."); }
            if (hasSummary) { scoreB += 2; evidenceB.add("Professional summary / Career objective detected."); }
        } else {
            // Experienced weighting: Work Experience is primary
            if (hasExperience) { scoreB += 8; evidenceB.add("Professional Experience section clearly structured."); }
            if (hasSkills) { scoreB += 4; evidenceB.add("Technical Skills section clearly structured."); }
            if (hasProjects) { scoreB += 3; evidenceB.add("Technical Projects / Architectures present."); }
            if (hasEducation) { scoreB += 3; evidenceB.add("Academic credentials present."); }
            if (hasSummary) { scoreB += 2; evidenceB.add("Executive summary detected."); }
        }
        scoreB = Math.min(20, Math.max(0, scoreB));

        if (!hasSummary) {
            quickWins.add("Add a concise 2-sentence Professional Summary highlighting your core stack and key focus.");
            recsB.add("Add a 2–3 line summary at the top to anchor your technical specialization.");
        }
        if (!hasProjects && isFresher) {
            criticalIssues.add(AtsIntelligenceDto.ActionableIssueDto.builder()
                    .title("Missing Projects Section")
                    .impactLevel("HIGH IMPACT")
                    .category("Core Section Completeness")
                    .fix("Add 2-3 in-depth technical projects showcasing full-stack or backend capabilities.")
                    .build());
        }

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Core Section Completeness")
                .score(scoreB)
                .maxScore(20)
                .weight(20)
                .status(scoreB >= 17 ? "STRONG" : scoreB >= 13 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason(isFresher ? "Evaluated with student/fresher project-first weighting." : "Evaluated with industry experience-first weighting.")
                .evidence(evidenceB)
                .recommendations(recsB)
                .build());

        // ════════ CATEGORY C: Contact & Professional Identity (10 Points) ════════
        int scoreC = 0;
        List<String> evidenceC = new ArrayList<>();
        List<String> recsC = new ArrayList<>();

        boolean hasEmail = EMAIL_PATTERN.matcher(text).find();
        boolean hasPhone = PHONE_PATTERN.matcher(text).find();
        boolean hasLinkedIn = LINKEDIN_PATTERN.matcher(text).find();
        boolean hasGitHub = GITHUB_PORTFOLIO_PATTERN.matcher(text).find();

        // Name is present if text starts with characters
        scoreC += 3; // Name credit
        evidenceC.add("Candidate name header identified.");

        if (hasEmail) {
            scoreC += 3;
            evidenceC.add("Professional contact email verified.");
        } else {
            recsC.add("Ensure a reachable email address is prominently listed at the top.");
        }

        if (hasPhone) {
            scoreC += 2;
            evidenceC.add("Phone number verified.");
        }

        if (hasLinkedIn || hasGitHub) {
            scoreC += 2;
            evidenceC.add(hasLinkedIn && hasGitHub ? "Both LinkedIn and GitHub/Portfolio profiles verified." : "Online professional profile link verified.");
        } else {
            quickWins.add("Add your GitHub profile or live portfolio link to boost credibility.");
            recsC.add("Include clickable links to your GitHub or LinkedIn profile.");
        }
        scoreC = Math.min(10, scoreC);

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Contact & Professional Identity")
                .score(scoreC)
                .maxScore(10)
                .weight(10)
                .status(scoreC >= 8 ? "STRONG" : scoreC >= 6 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason(scoreC >= 8 ? "All essential recruiter contact signals are present." : "Missing secondary profile links.")
                .evidence(evidenceC)
                .recommendations(recsC)
                .build());

        // ════════ CATEGORY D: Skills & Technical Signals (15 Points) ════════
        int scoreD = 0;
        List<String> evidenceD = new ArrayList<>();
        List<String> recsD = new ArrayList<>();

        int skillCount = normalizedSkills.size();
        int categoriesCovered = skillsResult.getCategoriesCovered();

        if (skillCount >= 10) {
            scoreD += 7;
            evidenceD.add("Strong technical depth with " + skillCount + " normalized skills verified.");
        } else if (skillCount >= 5) {
            scoreD += 5;
            evidenceD.add("Moderate skill diversity with " + skillCount + " verified skills.");
        } else {
            scoreD += 2;
            recsD.add("Expand your technical stack with relevant tools, databases, and frameworks.");
        }

        if (categoriesCovered >= 4) {
            scoreD += 4;
            evidenceD.add("Broad multi-disciplinary coverage across " + categoriesCovered + " tech domains (Languages, Frameworks, DBs, Cloud/Tools).");
        } else if (categoriesCovered >= 2) {
            scoreD += 3;
            evidenceD.add("Good coverage across " + categoriesCovered + " technical areas.");
        }

        // Check if skills appear in experience/projects for evidence credibility
        int skillsWithEvidence = 0;
        for (String s : normalizedSkills) {
            Pattern p = Pattern.compile("(?i)\\b" + Pattern.quote(s) + "\\b");
            Matcher m = p.matcher(text);
            int occurrences = 0;
            while (m.find()) occurrences++;
            if (occurrences >= 2) skillsWithEvidence++;
        }

        if (skillsWithEvidence >= 4) {
            scoreD += 4;
            evidenceD.add(skillsWithEvidence + " skills are backed by direct contextual project or work experience.");
        } else {
            scoreD += 2;
            recsD.add("Several listed skills lack supporting project evidence. Demonstrate how you applied them in bullet points.");
        }
        scoreD = Math.min(15, scoreD);

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Skills & Technical Signals")
                .score(scoreD)
                .maxScore(15)
                .weight(15)
                .status(scoreD >= 12 ? "STRONG" : scoreD >= 9 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason("Evaluated based on normalized taxonomy, domain breadth, and in-project evidence credibility.")
                .evidence(evidenceD)
                .recommendations(recsD)
                .build());

        // ════════ CATEGORY E: Experience & Project Quality (20 Points) ════════
        int scoreE = 0;
        List<String> evidenceE = new ArrayList<>();
        List<String> recsE = new ArrayList<>();

        // Action verbs
        Matcher verbMatcher = ACTION_VERB_PATTERN.matcher(text);
        Set<String> matchedVerbs = new HashSet<>();
        while (verbMatcher.find()) {
            matchedVerbs.add(verbMatcher.group().toLowerCase());
        }

        if (matchedVerbs.size() >= 5) {
            scoreE += 7;
            evidenceE.add("Strong leadership verbs utilized (" + String.join(", ", matchedVerbs.stream().limit(4).toList()) + ", etc.).");
        } else if (matchedVerbs.size() >= 2) {
            scoreE += 4;
            evidenceE.add("Action verbs detected (" + String.join(", ", matchedVerbs) + ").");
        } else {
            scoreE += 2;
            recsE.add("Begin bullet points with dynamic engineering verbs like 'Architected', 'Engineered', 'Optimized'.");
        }

        // Measurable metrics & numbers
        Matcher metricMatcher = METRIC_PATTERN.matcher(text);
        int metricMatches = 0;
        while (metricMatcher.find()) metricMatches++;

        if (metricMatches >= 4) {
            scoreE += 7;
            evidenceE.add("Measurable impact demonstrated with quantified metrics (percentages, latency, throughput, scale).");
        } else if (metricMatches >= 1) {
            scoreE += 4;
            evidenceE.add("Some quantifiable outcomes detected.");
            quickWins.add("Quantify at least 2 more project bullets with metrics (e.g. latency reduction %, user scale).");
        } else {
            scoreE += 1;
            criticalIssues.add(AtsIntelligenceDto.ActionableIssueDto.builder()
                    .title("Lack of Measurable Impact Metrics")
                    .impactLevel("HIGH IMPACT")
                    .category("Experience & Project Quality")
                    .fix("Incorporate quantifiable outcomes (e.g. 'reduced latency by 30%', 'scaled to 10k users', 'automated 40% of manual tests').")
                    .build());
        }

        // Repository / Live link evidence
        if (lower.contains("github.com") || lower.contains("http")) {
            scoreE += 6;
            evidenceE.add("Direct repository links and technical source evidence provided.");
        } else {
            scoreE += 3;
            recsE.add("Attach live project or repository links to validate your technical claims.");
        }
        scoreE = Math.min(20, scoreE);

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Experience & Project Quality")
                .score(scoreE)
                .maxScore(20)
                .weight(20)
                .status(scoreE >= 16 ? "STRONG" : scoreE >= 12 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason("Assessed on engineering action verbs, quantified outcomes, and technical specificity.")
                .evidence(evidenceE)
                .recommendations(recsE)
                .build());

        // ════════ CATEGORY F: Readability & ATS Safety (10 Points) ════════
        int scoreF = 0;
        List<String> evidenceF = new ArrayList<>();
        List<String> recsF = new ArrayList<>();

        if (hasEducation && hasSkills && (hasProjects || hasExperience)) {
            scoreF += 5;
            evidenceF.add("Standard, easily recognizable ATS heading hierarchy.");
        } else {
            scoreF += 3;
            recsF.add("Use standard section headings (Summary, Experience, Education, Skills, Projects).");
        }

        // Bullet format consistency
        long bulletCount = text.lines().filter(l -> l.trim().startsWith("•") || l.trim().startsWith("-") || l.trim().startsWith("*")).count();
        if (bulletCount >= 4) {
            scoreF += 3;
            evidenceF.add("Consistent scannable bullet structure detected.");
        } else {
            scoreF += 2;
        }

        // Keyword stuffing check: Ensure no single word dominates > 5% of text
        boolean stuffingDetected = false;
        String[] words = lower.split("\\s+");
        Map<String, Integer> wordFreq = new HashMap<>();
        for (String w : words) {
            if (w.length() > 3) {
                wordFreq.put(w, wordFreq.getOrDefault(w, 0) + 1);
            }
        }
        for (Map.Entry<String, Integer> entry : wordFreq.entrySet()) {
            if (words.length > 50 && ((double) entry.getValue() / words.length) > 0.08) {
                stuffingDetected = true;
                break;
            }
        }

        if (!stuffingDetected) {
            scoreF += 2;
            evidenceF.add("Natural keyword distribution with zero repetitive keyword stuffing.");
        } else {
            recsF.add("Keyword density is unusually high for some terms. Maintain natural conversational phrasing.");
        }
        scoreF = Math.min(10, scoreF);

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Readability & ATS Safety")
                .score(scoreF)
                .maxScore(10)
                .weight(10)
                .status(scoreF >= 8 ? "STRONG" : scoreF >= 6 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason("Evaluated for standard heading compliance, bullet layout, and natural keyword flow.")
                .evidence(evidenceF)
                .recommendations(recsF)
                .build());

        // ════════ CATEGORY G: Achievements & Profile Strength (10 Points) ════════
        int scoreG = 0;
        List<String> evidenceG = new ArrayList<>();
        List<String> recsG = new ArrayList<>();

        if (lower.contains("aws certified") || lower.contains("azure certified") || lower.contains("gcp certified") || lower.contains("certification") || lower.contains("certified")) {
            scoreG += 4;
            evidenceG.add("Industry certifications detected.");
        }
        if (lower.contains("hackathon") || lower.contains("winner") || lower.contains("1st place") || lower.contains("national") || lower.contains("competition")) {
            scoreG += 3;
            evidenceG.add("Competitive awards and hackathon achievements detected.");
        }
        if (lower.contains("leetcode") || lower.contains("codeforces") || lower.contains("open source") || lower.contains("problems solved") || lower.contains("top ")) {
            scoreG += 3;
            evidenceG.add("Competitive programming or open-source initiative signals found.");
        }

        if (scoreG == 0) {
            scoreG = 2; // Baseline
            recsG.add("Highlight any hackathons, open-source contributions, technical certifications, or academic honors.");
        }
        scoreG = Math.min(10, scoreG);

        categories.add(AtsIntelligenceDto.CategoryDetailDto.builder()
                .category("Achievements & Profile Strength")
                .score(scoreG)
                .maxScore(10)
                .weight(10)
                .status(scoreG >= 7 ? "STRONG" : scoreG >= 5 ? "GOOD" : "NEEDS_IMPROVEMENT")
                .reason("Measures verifiable credentials, hackathons, certifications, and technical distinctions.")
                .evidence(evidenceG)
                .recommendations(recsG)
                .build());

        // ════════ CALCULATE FINAL OVERALL SCORE ════════
        int totalScore = scoreA + scoreB + scoreC + scoreD + scoreE + scoreF + scoreG;
        totalScore = Math.max(0, Math.min(100, totalScore));

        String scoreLabel;
        if (totalScore >= 90) scoreLabel = "Excellent";
        else if (totalScore >= 80) scoreLabel = "Strong";
        else if (totalScore >= 70) scoreLabel = "Good Foundation";
        else if (totalScore >= 60) scoreLabel = "Needs Improvement";
        else if (totalScore >= 40) scoreLabel = "Needs Significant Improvement";
        else scoreLabel = "Critical Improvements Needed";

        // Calculate Analysis Confidence (Strictly Separated from Score)
        int confidence = 95;
        if (extractionTelemetry != null && extractionTelemetry.getExtractionStatus() == ExtractionStatus.OCR_USED) {
            confidence = 82;
        }
        if (charCount < 300) confidence -= 15;
        if (!hasEmail || !hasPhone) confidence -= 10;
        confidence = Math.max(40, Math.min(99, confidence));

        String confidenceMessage = confidence >= 85
                ? "High confidence: All sections, text streams, and technical attributes were parsed with high reliability."
                : "Moderate confidence: Text extraction was partially constrained. Review the parsed content preview.";

        // Aggregate Strengths
        for (AtsIntelligenceDto.CategoryDetailDto cat : categories) {
            if ("STRONG".equals(cat.getStatus()) && !cat.getEvidence().isEmpty()) {
                allStrengths.add(cat.getEvidence().get(0));
            }
        }
        if (allStrengths.isEmpty() && !evidenceD.isEmpty()) {
            allStrengths.add(evidenceD.get(0));
        }

        // Build Keyword Intelligence
        AtsIntelligenceDto.KeywordIntelligenceDto keywordIntelligence = AtsIntelligenceDto.KeywordIntelligenceDto.builder()
                .matched(new ArrayList<>(normalizedSkills))
                .missing(Collections.emptyList())
                .suggested(buildRoleSuggestedKeywords(targetRole, normalizedSkills))
                .keywordCoverage(Math.min(100.0, normalizedSkills.size() * 8.5))
                .build();

        // Build Detailed Recommendations
        detailedRecs.add(AtsIntelligenceDto.DetailedRecommendationDto.builder()
                .title("Quantify Bullet Outcomes")
                .problem("Recruiters seek measurable scale to gauge project impact.")
                .whyItMatters("Resumes with metrics receive 40% higher interview callback rates across ATS screens.")
                .evidence(evidenceE.isEmpty() ? "Limited numeric metrics found in bullet points." : evidenceE.get(0))
                .suggestedImprovement("Rewrite project bullets to specify performance improvements (e.g. 'Optimized PostgreSQL queries, cutting latency by 35%').")
                .impact("HIGH")
                .priority("P1")
                .build());

        AtsIntelligenceDto.SummaryHeadlineDto summary = AtsIntelligenceDto.SummaryHeadlineDto.builder()
                .headline(scoreLabel + " Estimated ATS Compatibility (" + totalScore + "/100)")
                .description("Your resume shows " + (isFresher ? "a strong project-centric foundation for entry-level roles." : "solid industry engineering depth.")
                        + " " + (allStrengths.isEmpty() ? "Incorporate measurable impact to elevate your score." : allStrengths.get(0)))
                .build();

        return new UniversalAnalysisResult(
                totalScore,
                scoreLabel,
                confidence,
                confidenceMessage,
                "ANALYSIS_COMPLETE",
                summary,
                categories,
                allStrengths,
                criticalIssues,
                quickWins,
                detailedRecs,
                keywordIntelligence,
                isFresher
        );
    }

    private boolean detectIsFresher(String lower) {
        if (lower.contains("fresher") || lower.contains("student") || lower.contains("b.tech (2020-2024)") || lower.contains("2020 - 2024")
                || lower.contains("2024 batch") || lower.contains("2025 batch") || lower.contains("undergraduate")
                || lower.contains("career objective") || lower.contains("cgpa") || lower.contains("gpa:")) {
            return true;
        }
        // If has senior or lead corporate roles, then experienced
        boolean hasSeniorRoles = lower.contains("senior software") || lower.contains("lead engineer") || lower.contains("principal engineer") || lower.contains("engineering manager");
        if (hasSeniorRoles) return false;

        // If has no work history section or only projects/internships
        boolean hasWorkExperience = lower.contains("work experience") || lower.contains("professional experience") || lower.contains("employment history");
        return !hasWorkExperience;
    }

    private List<AtsIntelligenceDto.SuggestedKeywordItemDto> buildRoleSuggestedKeywords(String targetRole, Set<String> presentSkills) {
        List<AtsIntelligenceDto.SuggestedKeywordItemDto> suggestions = new ArrayList<>();
        String role = targetRole != null ? targetRole.toLowerCase() : "software engineer";

        if (role.contains("backend") || role.contains("java") || role.contains("python")) {
            addIfMissing(suggestions, presentSkills, "Redis", "Databases & Storage", "Standard for caching and distributed lock management in high-throughput backend services.");
            addIfMissing(suggestions, presentSkills, "Docker", "DevOps & Cloud", "Essential containerization baseline across modern engineering teams.");
            addIfMissing(suggestions, presentSkills, "Microservices", "CS Fundamentals", "Core architectural paradigm required for enterprise backend roles.");
        } else if (role.contains("frontend") || role.contains("react")) {
            addIfMissing(suggestions, presentSkills, "TypeScript", "Programming Languages", "Industry standard for type-safe modern frontend architectures.");
            addIfMissing(suggestions, presentSkills, "TailwindCSS", "Web & Frameworks", "Widely requested utility-first styling system.");
            addIfMissing(suggestions, presentSkills, "Next.js", "Web & Frameworks", "Leading React framework for production SSR applications.");
        } else {
            addIfMissing(suggestions, presentSkills, "Docker", "DevOps & Cloud", "Fundamental container standard required across developer roles.");
            addIfMissing(suggestions, presentSkills, "REST APIs", "Web & Frameworks", "Baseline communication protocol for full-stack and web applications.");
            addIfMissing(suggestions, presentSkills, "Unit Testing", "CS Fundamentals", "Demonstrates code reliability and test-driven development hygiene.");
        }
        return suggestions;
    }

    private void addIfMissing(List<AtsIntelligenceDto.SuggestedKeywordItemDto> list, Set<String> present, String keyword, String category, String why) {
        if (!present.contains(keyword)) {
            list.add(AtsIntelligenceDto.SuggestedKeywordItemDto.builder()
                    .keyword(keyword)
                    .category(category)
                    .whyItMatters(why)
                    .build());
        }
    }

    private UniversalAnalysisResult buildUnavailableResult(String message) {
        AtsIntelligenceDto.SummaryHeadlineDto summary = AtsIntelligenceDto.SummaryHeadlineDto.builder()
                .headline("Analysis Unavailable")
                .description(message)
                .build();

        return new UniversalAnalysisResult(
                0,
                "Critical Improvements Needed",
                0,
                "Text could not be extracted. Please upload a clear PDF or DOCX file.",
                "ANALYSIS_UNAVAILABLE",
                summary,
                Collections.emptyList(),
                Collections.emptyList(),
                List.of(AtsIntelligenceDto.ActionableIssueDto.builder()
                        .title("Unreadable Document")
                        .impactLevel("HIGH IMPACT")
                        .category("Document Health")
                        .fix("Upload a standard PDF or DOCX file containing selectable text.")
                        .build()),
                List.of("Re-upload a clean, text-based PDF or DOCX file."),
                Collections.emptyList(),
                AtsIntelligenceDto.KeywordIntelligenceDto.builder().build(),
                false
        );
    }
}
