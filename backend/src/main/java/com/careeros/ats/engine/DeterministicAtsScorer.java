package com.careeros.ats.engine;

import com.careeros.ats.dto.AtsDetailedResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeterministicAtsScorer {

    private final SkillTaxonomyEngine skillTaxonomyEngine;
    private final KeywordExtractionEngine keywordExtractionEngine;

    // Contact regexes
    private static final Pattern EMAIL_PATTERN = Pattern.compile("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(?i)(linkedin\\.com/in/[a-zA-Z0-9_-]+|linkedin)");
    private static final Pattern GITHUB_PATTERN = Pattern.compile("(?i)(github\\.com/[a-zA-Z0-9_-]+|github)");
    private static final Pattern PORTFOLIO_PATTERN = Pattern.compile("(?i)(portfolio|https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})");

    // Sections regexes
    private static final Pattern SUMMARY_SECTION = Pattern.compile("(?i)\\b(summary|objective|professional summary|profile|about me)\\b");
    private static final Pattern EDUCATION_SECTION = Pattern.compile("(?i)\\b(education|academic background|academics|qualifications)\\b");
    private static final Pattern SKILLS_SECTION = Pattern.compile("(?i)\\b(technical skills|skills|technologies|core competencies|programming skills)\\b");
    private static final Pattern EXPERIENCE_SECTION = Pattern.compile("(?i)\\b(work experience|experience|employment history|internships|professional experience)\\b");
    private static final Pattern PROJECTS_SECTION = Pattern.compile("(?i)\\b(projects|academic projects|personal projects|technical projects)\\b");
    private static final Pattern CERTIFICATIONS_SECTION = Pattern.compile("(?i)\\b(certifications|certificates|achievements|awards|honors|extracurricular)\\b");

    // Strong engineering action verbs
    private static final List<String> ACTION_VERBS = List.of(
            "developed", "engineered", "designed", "implemented", "optimized", "architected", "built",
            "automated", "deployed", "scaled", "integrated", "spearheaded", "refactored", "created",
            "analyzed", "reduced", "improved", "increased", "maintained", "orchestrated", "migrated"
    );

    // Quantified metrics pattern e.g., "30%", "100+ users", "50ms", "4x", "scaled to 10000"
    private static final Pattern METRICS_PATTERN = Pattern.compile("(\\b\\d+(\\.\\d+)?%|\\b\\d+\\+\\s*(users|clients|requests|qps|stars)|\\b(reduced|improved|increased|cut|boosted|saved)\\s+.*\\b\\d+|\\b\\d+x\\b|\\b\\d+\\s*(ms|seconds|minutes|hours)\\b)");

    // Weak / generic fluff buzzwords
    private static final List<String> WEAK_BUZZWORDS = List.of(
            "hard worker", "go getter", "results oriented person", "team player", "highly motivated individual",
            "fast learner", "think outside the box", "synergy", "detail oriented person"
    );

    // First person pronouns
    private static final Pattern FIRST_PERSON_PATTERN = Pattern.compile("(?i)\\b(i|me|my|myself|our|we)\\b");

    public record OverallScoreResult(
            int overallScore,
            String readinessLevel,
            int completenessScore,
            int atsCompatibilityScore,
            int skillsScore,
            int experienceScore,
            int impactScore,
            int languageScore,
            List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown,
            List<String> strengths,
            List<String> improvements,
            List<String> warnings,
            SkillTaxonomyEngine.ExtractedSkillsResult skillsResult
    ) {}

    public OverallScoreResult scoreOverallResume(String rawText) {
        if (rawText == null || rawText.trim().length() < 30) {
            return buildEmptyOverallResult("We could not extract readable text from this resume. Please upload a valid text-based PDF or DOCX.");
        }

        String text = rawText;
        String lowerText = text.toLowerCase();

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // A. RESUME COMPLETENESS (20 PTS)
        int completenessScore = 0;

        // 1. Contact Info (3 pts)
        boolean hasEmail = EMAIL_PATTERN.matcher(text).find();
        boolean hasPhone = PHONE_PATTERN.matcher(text).find();
        boolean hasLocation = lowerText.contains("india") || lowerText.contains("ca") || lowerText.contains("ny") || lowerText.contains("remote") || lowerText.contains("bangalore") || lowerText.contains("hyderabad") || lowerText.contains("pune") || lowerText.contains("mumbai") || lowerText.contains("delhi") || lowerText.contains("city") || lowerText.contains("state");
        int contactPts = 0;
        if (hasEmail) contactPts += 1;
        if (hasPhone) contactPts += 1;
        if (hasLocation || (hasEmail && hasPhone)) contactPts += 1;
        completenessScore += contactPts;

        // 2. Summary / Objective (2 pts)
        boolean hasSummary = SUMMARY_SECTION.matcher(lowerText).find();
        if (hasSummary) completenessScore += 2;

        // 3. Education (3 pts)
        boolean hasEduSection = EDUCATION_SECTION.matcher(lowerText).find();
        boolean hasDegree = lowerText.contains("b.tech") || lowerText.contains("b.e") || lowerText.contains("bachelor") || lowerText.contains("master") || lowerText.contains("b.s") || lowerText.contains("m.s") || lowerText.contains("computer science") || lowerText.contains("engineering") || lowerText.contains("university") || lowerText.contains("institute");
        int eduPts = 0;
        if (hasEduSection) eduPts += 1;
        if (hasDegree) eduPts += 2;
        completenessScore += Math.min(3, eduPts);

        // 4. Technical Skills Section (3 pts)
        SkillTaxonomyEngine.ExtractedSkillsResult skillsResult = skillTaxonomyEngine.extractSkills(text);
        boolean hasSkillsSection = SKILLS_SECTION.matcher(lowerText).find();
        int skillsPresencePts = 0;
        if (hasSkillsSection) skillsPresencePts += 1;
        if (skillsResult.getDistinctCount() >= 4) skillsPresencePts += 2;
        else if (skillsResult.getDistinctCount() >= 2) skillsPresencePts += 1;
        completenessScore += Math.min(3, skillsPresencePts);

        // 5. Work Experience / Internships (3 pts)
        boolean hasExpSection = EXPERIENCE_SECTION.matcher(lowerText).find();
        boolean hasJobTerms = lowerText.contains("intern") || lowerText.contains("engineer") || lowerText.contains("developer") || lowerText.contains("analyst") || lowerText.contains("trainee") || lowerText.contains("contributor");
        int expPts = 0;
        if (hasExpSection) expPts += 1;
        if (hasJobTerms) expPts += 2;
        completenessScore += Math.min(3, expPts);

        // 6. Projects (3 pts)
        boolean hasProjectsSection = PROJECTS_SECTION.matcher(lowerText).find();
        boolean hasProjectTerms = lowerText.contains("github") || lowerText.contains("api") || lowerText.contains("app") || lowerText.contains("full stack") || lowerText.contains("web application") || lowerText.contains("system");
        int projPts = 0;
        if (hasProjectsSection) projPts += 1;
        if (hasProjectTerms) projPts += 2;
        completenessScore += Math.min(3, projPts);

        // 7. Achievements / Certifications (2 pts)
        boolean hasCertSection = CERTIFICATIONS_SECTION.matcher(lowerText).find();
        boolean hasCertTerms = lowerText.contains("certified") || lowerText.contains("aws") || lowerText.contains("coursera") || lowerText.contains("hackathon") || lowerText.contains("leetCode") || lowerText.contains("certificate") || lowerText.contains("rank");
        int certPts = (hasCertSection ? 1 : 0) + (hasCertTerms ? 1 : 0);
        completenessScore += Math.min(2, certPts);

        // 8. Professional Links (1 pt)
        boolean hasLinks = LINKEDIN_PATTERN.matcher(text).find() || GITHUB_PATTERN.matcher(text).find() || PORTFOLIO_PATTERN.matcher(text).find();
        if (hasLinks) completenessScore += 1;

        completenessScore = Math.min(20, Math.max(0, completenessScore));

        // B. ATS FORMATTING & PARSABILITY (15 PTS)
        int parsabilityScore = 0;
        if (text.length() >= 300) parsabilityScore += 4;
        else if (text.length() >= 100) parsabilityScore += 2;

        int detectedStandardHeaders = 0;
        if (hasEduSection) detectedStandardHeaders++;
        if (hasSkillsSection) detectedStandardHeaders++;
        if (hasExpSection || hasProjectsSection) detectedStandardHeaders++;
        if (hasSummary || hasCertSection) detectedStandardHeaders++;
        parsabilityScore += Math.min(4, detectedStandardHeaders);

        // Balance check: Check if text has reasonable linebreaks and bullet formatting
        String[] lines = text.split("\r?\n");
        boolean hasReasonableStructure = lines.length >= 12 && lines.length <= 250;
        boolean hasExcessiveParagraph = Arrays.stream(lines).anyMatch(l -> l.length() > 1500);
        if (hasReasonableStructure && !hasExcessiveParagraph) parsabilityScore += 3;
        else if (!hasExcessiveParagraph) parsabilityScore += 2;

        // Character cleanliness (no binary garbage)
        long nonAsciiCount = text.chars().filter(c -> c > 127 && c != 8220 && c != 8221 && c != 8217 && c != 8226 && c != 8211 && c != 8212).count();
        double nonAsciiRatio = (double) nonAsciiCount / Math.max(1, text.length());
        if (nonAsciiRatio < 0.01) parsabilityScore += 4;
        else if (nonAsciiRatio < 0.03) parsabilityScore += 2;
        else warnings.add("Some decorative non-standard characters detected. Keep formatting clean and standard.");

        parsabilityScore = Math.min(15, Math.max(0, parsabilityScore));

        // C. TECHNICAL SKILL COVERAGE (20 PTS)
        int skillCoverageScore = 0;
        int distinctSkills = skillsResult.getDistinctCount();
        int categoriesCovered = skillsResult.getCategoriesCovered();

        if (distinctSkills >= 12) skillCoverageScore += 12;
        else if (distinctSkills >= 8) skillCoverageScore += 9;
        else if (distinctSkills >= 5) skillCoverageScore += 6;
        else if (distinctSkills >= 3) skillCoverageScore += 4;
        else if (distinctSkills >= 1) skillCoverageScore += 2;

        if (categoriesCovered >= 4) skillCoverageScore += 8;
        else if (categoriesCovered >= 3) skillCoverageScore += 6;
        else if (categoriesCovered >= 2) skillCoverageScore += 4;
        else if (categoriesCovered >= 1) skillCoverageScore += 2;

        skillCoverageScore = Math.min(20, Math.max(0, skillCoverageScore));

        // D. PROJECT & EXPERIENCE QUALITY (20 PTS)
        int experienceQualityScore = 0;

        // 1. Action verbs count
        int matchedActionVerbs = 0;
        for (String verb : ACTION_VERBS) {
            if (Pattern.compile("\\b" + verb + "\\b", Pattern.CASE_INSENSITIVE).matcher(text).find()) {
                matchedActionVerbs++;
            }
        }
        if (matchedActionVerbs >= 8) experienceQualityScore += 6;
        else if (matchedActionVerbs >= 5) experienceQualityScore += 4;
        else if (matchedActionVerbs >= 2) experienceQualityScore += 2;

        // 2. Technologies linked in context
        boolean techInProjects = lowerText.contains("using ") || lowerText.contains("with ") || lowerText.contains("built with") || lowerText.contains("stack:") || lowerText.contains("technologies:");
        if (techInProjects && distinctSkills >= 4) experienceQualityScore += 5;
        else if (distinctSkills >= 3) experienceQualityScore += 3;

        // 3. Technical scope (APIs, Database, Microservices, CI/CD, Full Stack)
        boolean hasScope = lowerText.contains("api") || lowerText.contains("database") || lowerText.contains("full stack") || lowerText.contains("backend") || lowerText.contains("frontend") || lowerText.contains("system");
        if (hasScope) experienceQualityScore += 4;

        // 4. Live demo / GitHub repo links
        if (hasLinks) experienceQualityScore += 2;

        // 5. Structured roles / dates
        boolean hasDates = Pattern.compile("\\b(20[12][0-9]|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\\b", Pattern.CASE_INSENSITIVE).matcher(text).find();
        if (hasDates) experienceQualityScore += 3;

        experienceQualityScore = Math.min(20, Math.max(0, experienceQualityScore));

        // E. ACHIEVEMENT & IMPACT QUALITY (15 PTS)
        int impactScore = 0;
        Matcher metricsMatcher = METRICS_PATTERN.matcher(text);
        int metricsCount = 0;
        while (metricsMatcher.find()) {
            metricsCount++;
        }
        if (metricsCount >= 4) impactScore += 8;
        else if (metricsCount >= 2) impactScore += 5;
        else if (metricsCount >= 1) impactScore += 3;

        if (hasCertSection && hasCertTerms) impactScore += 7;
        else if (hasCertTerms || hasCertSection) impactScore += 4;

        impactScore = Math.min(15, Math.max(0, impactScore));

        // F. LANGUAGE & RESUME QUALITY (10 PTS)
        int languageScore = 0;

        // Action-oriented bullets
        if (matchedActionVerbs >= 4) languageScore += 3;
        else if (matchedActionVerbs >= 2) languageScore += 2;

        // First-person check
        Matcher fpMatcher = FIRST_PERSON_PATTERN.matcher(text);
        int fpCount = 0;
        while (fpMatcher.find()) fpCount++;
        if (fpCount == 0) languageScore += 2;
        else if (fpCount <= 2) languageScore += 1;
        else warnings.add("Found multiple first-person pronouns ('I', 'my'). Resume bullets should start directly with action verbs.");

        // Weak buzzword check
        int buzzwordCount = (int) WEAK_BUZZWORDS.stream().filter(lowerText::contains).count();
        if (buzzwordCount == 0) languageScore += 2;
        else if (buzzwordCount <= 1) languageScore += 1;
        else improvements.add("Replace generic statements (e.g. 'hard worker') with measurable engineering results.");

        // Concise length & structure
        if (text.length() >= 500 && text.length() <= 8000) languageScore += 3;
        else if (text.length() > 0) languageScore += 1;

        languageScore = Math.min(10, Math.max(0, languageScore));

        // Calculate Overall Score
        int totalScore = completenessScore + parsabilityScore + skillCoverageScore + experienceQualityScore + impactScore + languageScore;
        int clampedOverall = Math.min(100, Math.max(10, totalScore));

        String readinessLevel;
        if (clampedOverall >= 85) readinessLevel = "Excellent ATS readiness";
        else if (clampedOverall >= 75) readinessLevel = "Strong ATS readiness";
        else if (clampedOverall >= 60) readinessLevel = "Good foundation";
        else if (clampedOverall >= 40) readinessLevel = "Basic ATS readiness";
        else readinessLevel = "Needs significant improvement";

        // Generate dynamic deterministic strengths & improvements
        if (distinctSkills >= 8) {
            strengths.add("Strong technical skill coverage with " + distinctSkills + " verified skills across " + categoriesCovered + " technical categories.");
        }
        if (matchedActionVerbs >= 5) {
            strengths.add("Active engineering vocabulary with " + matchedActionVerbs + " distinct action verbs (e.g., Developed, Engineered, Optimized).");
        }
        if (hasEmail && hasPhone && hasLinks) {
            strengths.add("Complete professional contact header including GitHub and LinkedIn profiles.");
        }
        if (metricsCount >= 2) {
            strengths.add("Measurable impact detected with " + metricsCount + " quantified metrics and performance outcomes.");
        }

        if (metricsCount < 2) {
            improvements.add("Quantify your project and work achievements with measurable numbers (e.g., 'improved API response by 35%', 'scaled to 5,000+ users').");
        }
        if (distinctSkills < 6) {
            improvements.add("Add missing core technical keywords and frameworks to ensure ATS parsers recognize your technical depth.");
        }
        if (!hasSummary) {
            improvements.add("Add a concise 2–3 line Professional Summary at the top to give recruiters instant context.");
        }
        if (!hasLinks) {
            improvements.add("Include clickable GitHub, LinkedIn, or live project links to prove hands-on technical work.");
        }

        List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown = List.of(
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Resume Completeness")
                        .score(completenessScore)
                        .maxScore(20)
                        .percentage(Math.round(((double) completenessScore / 20.0) * 100.0))
                        .feedback(completenessScore >= 16 ? "Comprehensive structure with all essential sections present." : "Missing one or more recommended sections (e.g. Summary, Links, or Certifications).")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("ATS Formatting & Parsability")
                        .score(parsabilityScore)
                        .maxScore(15)
                        .percentage(Math.round(((double) parsabilityScore / 15.0) * 100.0))
                        .feedback(parsabilityScore >= 12 ? "Clean standard headers and easily extractable plain text." : "Improve header formatting and ensure standard readable fonts.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Technical Skill Coverage")
                        .score(skillCoverageScore)
                        .maxScore(20)
                        .percentage(Math.round(((double) skillCoverageScore / 20.0) * 100.0))
                        .feedback(skillCoverageScore >= 15 ? "Broad skill coverage across programming, frameworks, and databases." : "Expand your normalized skills across core backend, cloud, and CS fundamentals.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Projects & Experience Quality")
                        .score(experienceQualityScore)
                        .maxScore(20)
                        .percentage(Math.round(((double) experienceQualityScore / 20.0) * 100.0))
                        .feedback(experienceQualityScore >= 15 ? "Strong technical verbs and contextual technology linking in project descriptions." : "Describe your projects using action verbs, architecture details, and GitHub links.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Achievements & Impact")
                        .score(impactScore)
                        .maxScore(15)
                        .percentage(Math.round(((double) impactScore / 15.0) * 100.0))
                        .feedback(impactScore >= 10 ? "Good demonstration of quantified metrics, competition rankings, or certifications." : "Add measurable percentage gains, user counts, or verified certifications.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Language & Resume Quality")
                        .score(languageScore)
                        .maxScore(10)
                        .percentage(Math.round(((double) languageScore / 10.0) * 100.0))
                        .feedback(languageScore >= 8 ? "Professional tone with high action density and zero generic filler." : "Avoid first-person pronouns and replace generic phrases with technical outcomes.")
                        .build()
        );

        return new OverallScoreResult(
                clampedOverall,
                readinessLevel,
                completenessScore,
                parsabilityScore,
                skillCoverageScore,
                experienceQualityScore,
                impactScore,
                languageScore,
                breakdown,
                strengths,
                improvements,
                warnings,
                skillsResult
        );
    }

    public record JobMatchResult(
            int jobMatchScore,
            String matchLevel,
            int requiredSkillsScore,
            int keywordScore,
            int responsibilityScore,
            int eligibilityScore,
            int semanticScore,
            List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown,
            List<String> matchedSkills,
            List<String> missingSkills,
            List<String> additionalResumeSkills,
            List<String> matchedKeywords,
            List<String> missingKeywords,
            double keywordMatchPercentage,
            List<String> strengths,
            List<String> improvements
    ) {}

    public JobMatchResult scoreJobMatch(String resumeText, String jdText) {
        if (resumeText == null || resumeText.isBlank() || jdText == null || jdText.isBlank()) {
            return buildEmptyJobMatchResult();
        }

        SkillTaxonomyEngine.ExtractedSkillsResult resumeSkills = skillTaxonomyEngine.extractSkills(resumeText);
        SkillTaxonomyEngine.ExtractedSkillsResult jdSkills = skillTaxonomyEngine.extractSkills(jdText);
        KeywordExtractionEngine.ExtractedJdKeywordsResult jdKeywords = keywordExtractionEngine.extractAndMatchKeywords(jdText, resumeText);

        Set<String> rSkills = resumeSkills.getNormalizedSkills();
        Set<String> jSkills = jdSkills.getNormalizedSkills();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> additionalResumeSkills = new ArrayList<>();

        for (String s : jSkills) {
            if (rSkills.contains(s)) {
                matchedSkills.add(s);
            } else {
                missingSkills.add(s);
            }
        }

        for (String s : rSkills) {
            if (!jSkills.contains(s)) {
                additionalResumeSkills.add(s);
            }
        }

        // A. REQUIRED SKILLS MATCH (30 PTS)
        int requiredSkillsScore;
        if (jSkills.isEmpty()) {
            requiredSkillsScore = Math.min(30, rSkills.size() * 3);
        } else {
            double skillRatio = (double) matchedSkills.size() / jSkills.size();
            requiredSkillsScore = (int) Math.round(skillRatio * 30.0);
        }
        requiredSkillsScore = Math.min(30, Math.max(0, requiredSkillsScore));

        // B. KEYWORD MATCH (20 PTS)
        int keywordScore = (int) Math.round((jdKeywords.getMatchPercentage() / 100.0) * 20.0);
        keywordScore = Math.min(20, Math.max(0, keywordScore));

        // C. EXPERIENCE & RESPONSIBILITY MATCH (20 PTS)
        String lowerResume = resumeText.toLowerCase();
        String lowerJd = jdText.toLowerCase();
        List<String> coreResponsibilityTerms = List.of(
                "rest api", "microservices", "unit testing", "database design", "system architecture",
                "agile", "collaboration", "code review", "debugging", "ci/cd", "cloud", "scalability"
        );
        int respMatches = 0;
        int respTotal = 0;
        for (String term : coreResponsibilityTerms) {
            if (lowerJd.contains(term)) {
                respTotal++;
                if (lowerResume.contains(term)) {
                    respMatches++;
                }
            }
        }
        int responsibilityScore;
        if (respTotal == 0) {
            responsibilityScore = 15;
        } else {
            responsibilityScore = (int) Math.round(((double) respMatches / respTotal) * 20.0);
        }
        responsibilityScore = Math.min(20, Math.max(0, responsibilityScore));

        // D. EDUCATION & ELIGIBILITY MATCH (10 PTS)
        int eligibilityScore = 10;
        boolean jdRequiresDegree = lowerJd.contains("bachelor") || lowerJd.contains("b.tech") || lowerJd.contains("b.e") || lowerJd.contains("degree") || lowerJd.contains("computer science");
        boolean resumeHasDegree = lowerResume.contains("bachelor") || lowerResume.contains("b.tech") || lowerResume.contains("b.e") || lowerResume.contains("m.tech") || lowerResume.contains("computer science") || lowerResume.contains("engineering");
        if (jdRequiresDegree && !resumeHasDegree) {
            eligibilityScore = 4;
        }

        // E. SEMANTIC / NLP RELEVANCE OVERLAP (20 PTS)
        double semanticRatio = calculateJaccardRelevance(resumeText, jdText);
        int semanticScore = (int) Math.round(semanticRatio * 20.0);
        semanticScore = Math.min(20, Math.max(5, semanticScore));

        int totalJobScore = requiredSkillsScore + keywordScore + responsibilityScore + eligibilityScore + semanticScore;
        int clampedJobScore = Math.min(100, Math.max(10, totalJobScore));

        String matchLevel;
        if (clampedJobScore >= 85) matchLevel = "Excellent Job Match";
        else if (clampedJobScore >= 75) matchLevel = "Strong Job Match";
        else if (clampedJobScore >= 60) matchLevel = "Good Job Match";
        else if (clampedJobScore >= 40) matchLevel = "Basic Job Match";
        else matchLevel = "Low Job Match";

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();

        if (!matchedSkills.isEmpty()) {
            strengths.add("Strong alignment on core technologies: " + String.join(", ", matchedSkills.stream().limit(5).collect(Collectors.toList())) + ".");
        }
        if (keywordScore >= 14) {
            strengths.add("High keyword density matching " + Math.round(jdKeywords.getMatchPercentage()) + "% of prioritized job requirements.");
        }

        if (!missingSkills.isEmpty()) {
            improvements.add("Incorporate relevant experience with: " + String.join(", ", missingSkills.stream().limit(5).collect(Collectors.toList())) + ".");
        }
        if (responsibilityScore < 14) {
            improvements.add("Emphasize relevant engineering responsibilities like unit testing, CI/CD pipelines, and API integrations.");
        }

        List<AtsDetailedResponseDto.CategoryBreakdownDto> breakdown = List.of(
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Required Technical Skills")
                        .score(requiredSkillsScore)
                        .maxScore(30)
                        .percentage(Math.round(((double) requiredSkillsScore / 30.0) * 100.0))
                        .feedback("Matched " + matchedSkills.size() + " of " + Math.max(1, jSkills.size()) + " target skills.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Targeted Keyword Match")
                        .score(keywordScore)
                        .maxScore(20)
                        .percentage(Math.round(((double) keywordScore / 20.0) * 100.0))
                        .feedback(Math.round(jdKeywords.getMatchPercentage()) + "% weighted priority keyword coverage.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Experience & Responsibilities")
                        .score(responsibilityScore)
                        .maxScore(20)
                        .percentage(Math.round(((double) responsibilityScore / 20.0) * 100.0))
                        .feedback("Alignment with day-to-day engineering duties and domain terms.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Education & Eligibility")
                        .score(eligibilityScore)
                        .maxScore(10)
                        .percentage(Math.round(((double) eligibilityScore / 10.0) * 100.0))
                        .feedback(eligibilityScore >= 8 ? "Meets specified degree and academic prerequisites." : "Verify educational degree matches job posting requirements.")
                        .build(),
                AtsDetailedResponseDto.CategoryBreakdownDto.builder()
                        .category("Semantic Content Alignment")
                        .score(semanticScore)
                        .maxScore(20)
                        .percentage(Math.round(((double) semanticScore / 20.0) * 100.0))
                        .feedback("Overall contextual similarity between resume achievements and job scope.")
                        .build()
        );

        return new JobMatchResult(
                clampedJobScore,
                matchLevel,
                requiredSkillsScore,
                keywordScore,
                responsibilityScore,
                eligibilityScore,
                semanticScore,
                breakdown,
                matchedSkills,
                missingSkills,
                additionalResumeSkills,
                jdKeywords.getMatchedKeywords(),
                jdKeywords.getMissingKeywords(),
                jdKeywords.getMatchPercentage(),
                strengths,
                improvements
        );
    }

    private double calculateJaccardRelevance(String text1, String text2) {
        Set<String> set1 = Arrays.stream(text1.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());
        Set<String> set2 = Arrays.stream(text2.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 3)
                .collect(Collectors.toSet());

        if (set1.isEmpty() || set2.isEmpty()) return 0.2;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        double jaccard = (double) intersection.size() / Math.max(1, union.size());
        // Normalize: Jaccard for text typically ranges 0.05-0.35, scale into 0.3-0.9
        return Math.min(1.0, Math.max(0.2, jaccard * 3.5));
    }

    private OverallScoreResult buildEmptyOverallResult(String warningMessage) {
        return new OverallScoreResult(
                0,
                "Needs significant improvement",
                0, 0, 0, 0, 0, 0,
                Collections.emptyList(),
                Collections.emptyList(),
                List.of("Upload a clean, text-based PDF or DOCX resume to perform full ATS analysis."),
                List.of(warningMessage),
                new SkillTaxonomyEngine.ExtractedSkillsResult(Collections.emptySet(), Collections.emptyMap(), 0, 0)
        );
    }

    private JobMatchResult buildEmptyJobMatchResult() {
        return new JobMatchResult(
                0,
                "Low Job Match",
                0, 0, 0, 0, 0,
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                0.0,
                Collections.emptyList(),
                List.of("Please paste a complete job description to calculate a targeted match.")
        );
    }
}
