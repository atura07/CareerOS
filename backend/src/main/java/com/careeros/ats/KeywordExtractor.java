package com.careeros.ats;

import com.careeros.ats.engine.SkillTaxonomyEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class KeywordExtractor {

    private static final Logger log = LoggerFactory.getLogger(KeywordExtractor.class);
    private final SkillTaxonomyEngine skillTaxonomyEngine;

    public KeywordExtractor(SkillTaxonomyEngine skillTaxonomyEngine) {
        this.skillTaxonomyEngine = skillTaxonomyEngine;
    }

    public List<KeywordMatch> extractKeywords(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) {
            return Collections.emptyList();
        }

        SkillTaxonomyEngine.ExtractedSkillsResult result = skillTaxonomyEngine.extractSkills(resumeText);
        List<KeywordMatch> matches = new ArrayList<>();

        for (String skill : result.getNormalizedSkills()) {
            matches.add(new KeywordMatch(skill, true, "skill", 1));
        }

        return matches;
    }

    public List<KeywordMatch> extractSkills(String resumeText) {
        return extractKeywords(resumeText);
    }

    public List<KeywordMatch> extractEducation(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) return Collections.emptyList();
        List<KeywordMatch> matches = new ArrayList<>();
        String lower = resumeText.toLowerCase();

        if (lower.contains("bachelor") || lower.contains("b.tech") || lower.contains("b.e") || lower.contains("b.s")) {
            matches.add(new KeywordMatch("Bachelor's Degree", true, "education", 1));
        }
        if (lower.contains("master") || lower.contains("m.tech") || lower.contains("m.s")) {
            matches.add(new KeywordMatch("Master's Degree", true, "education", 1));
        }
        if (lower.contains("computer science") || lower.contains("information technology")) {
            matches.add(new KeywordMatch("Computer Science", true, "education", 1));
        }

        return matches;
    }

    public List<KeywordMatch> extractProjects(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) return Collections.emptyList();
        List<KeywordMatch> matches = new ArrayList<>();
        String lower = resumeText.toLowerCase();

        if (lower.contains("api") || lower.contains("rest")) matches.add(new KeywordMatch("REST API", true, "project", 1));
        if (lower.contains("microservices")) matches.add(new KeywordMatch("Microservices", true, "project", 1));
        if (lower.contains("database") || lower.contains("sql")) matches.add(new KeywordMatch("Database Integration", true, "project", 1));
        if (lower.contains("full stack") || lower.contains("frontend")) matches.add(new KeywordMatch("Full Stack", true, "project", 1));

        return matches;
    }

    public List<KeywordMatch> extractExperience(String resumeText) {
        if (resumeText == null || resumeText.isBlank()) return Collections.emptyList();
        List<KeywordMatch> matches = new ArrayList<>();
        String lower = resumeText.toLowerCase();

        if (lower.contains("developed") || lower.contains("engineered")) matches.add(new KeywordMatch("Software Development", true, "experience", 1));
        if (lower.contains("optimized") || lower.contains("scaled")) matches.add(new KeywordMatch("Performance Optimization", true, "experience", 1));
        if (lower.contains("intern")) matches.add(new KeywordMatch("Internship Experience", true, "experience", 1));

        return matches;
    }

    public Map<String, Boolean> detectSections(String resumeText) {
        Map<String, Boolean> sections = new LinkedHashMap<>();
        if (resumeText == null || resumeText.isBlank()) {
            sections.put("summary", false);
            sections.put("experience", false);
            sections.put("education", false);
            sections.put("skills", false);
            sections.put("projects", false);
            sections.put("certifications", false);
            return sections;
        }

        String lower = resumeText.toLowerCase();
        sections.put("summary", lower.contains("summary") || lower.contains("objective") || lower.contains("profile"));
        sections.put("experience", lower.contains("experience") || lower.contains("employment") || lower.contains("internship"));
        sections.put("education", lower.contains("education") || lower.contains("academic"));
        sections.put("skills", lower.contains("skills") || lower.contains("technologies"));
        sections.put("projects", lower.contains("projects") || lower.contains("project"));
        sections.put("certifications", lower.contains("certifications") || lower.contains("certificates") || lower.contains("achievements"));

        return sections;
    }
}
