package com.careeros.ats;

import com.careeros.ats.dto.AtsIntelligenceDto;
import com.careeros.ats.dto.BulletImprovementRequestDto;
import com.careeros.ats.dto.BulletImprovementResponseDto;
import com.careeros.ats.engine.*;
import com.careeros.openai.OpenAIClient;
import com.careeros.resume.extraction.ExtractedResumeContent;
import com.careeros.resume.extraction.ExtractionMethod;
import com.careeros.resume.extraction.ExtractionStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AtsIntelligenceEngineTest {

    private SkillTaxonomyEngine skillTaxonomyEngine;
    private KeywordExtractionEngine keywordExtractionEngine;
    private UniversalAtsIntelligenceEngine universalEngine;
    private JobMatchIntelligenceEngine jobMatchEngine;
    private BulletImprovementEngine bulletImprovementEngine;

    @Mock
    private OpenAIClient openAIClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String STRONG_EXPERIENCED_RESUME = """
            ATUL SHARMA
            Email: atul.sharma@example.com | Phone: +91 9876543210 | Bangalore, India
            GitHub: github.com/atulsharma | LinkedIn: linkedin.com/in/atulsharma | Portfolio: atulsharma.dev

            PROFESSIONAL SUMMARY
            Results-driven Senior Software Engineer with 4+ years of experience designing high-throughput microservices and distributed systems using Java, Spring Boot, React, and PostgreSQL.

            TECHNICAL SKILLS
            Languages: Java, Python, C++, C#, JavaScript, TypeScript, SQL
            Frameworks: Spring Boot, Node.js, React.js, .NET Core, Express.js, REST APIs, Microservices
            Databases & Cloud: PostgreSQL, MySQL, Redis, Docker, Kubernetes, AWS, Git, Linux
            Fundamentals: Data Structures, Algorithms, OOP, Distributed Systems, CI/CD

            WORK EXPERIENCE
            Senior Software Engineer | TechCorp Global | 2022 - Present
            - Architected distributed microservices with Spring Boot, serving 100,000+ daily active users with 99.99% uptime.
            - Optimized slow SQL database queries and introduced Redis caching, reducing average API response latency by 45%.
            - Automated deployment pipelines using Docker, Kubernetes, and GitHub Actions, improving release cadence by 50%.

            Software Engineer | CloudScale Inc | 2020 - 2022
            - Engineered resilient REST APIs in Java and PostgreSQL for real-time transaction processing.
            - Containerized 12 microservices with Docker, reducing environment provisioning time by 60%.

            PROJECTS
            CareerOS - AI Career Platform | Java, Spring Boot, React, PostgreSQL | GitHub: github.com/atulsharma/careeros
            - Built scalable multi-stage ATS resume analyzer processing PDF and DOCX files in sub-500ms latency.
            - Implemented JWT authentication and role-based access control supporting 5,000+ concurrent requests.

            ACHIEVEMENTS & CERTIFICATIONS
            - AWS Certified Solutions Architect (2023)
            - 1st Place Winner at National Hackathon 2023 out of 150 participating teams
            - Solved 500+ algorithmic challenges on LeetCode (Top 3% ranking)
            """;

    private final String FRESHER_PROJECT_HEAVY_RESUME = """
            Priya Patel
            Email: priya.patel@example.com | Phone: +91 9123456780 | Bangalore, India
            GitHub: github.com/priyapatel | LinkedIn: linkedin.com/in/priyapatel

            CAREER OBJECTIVE
            Ambitious Computer Science Graduate (2024 Batch) specializing in Full Stack Development with React, Node.js, and MongoDB. Eager to contribute to scalable web applications.

            EDUCATION
            Bachelor of Technology in Computer Science & Engineering (2020 - 2024)
            National Institute of Technology | CGPA: 8.9 / 10.0

            TECHNICAL SKILLS
            Programming: JavaScript, TypeScript, Python, C++, Java, SQL
            Web Technologies: React.js, Next.js, Node.js, Express.js, TailwindCSS, REST APIs
            Databases & Tools: MongoDB, PostgreSQL, Git, Docker, Postman, Linux

            TECHNICAL PROJECTS
            DevPlatform - Developer Community Hub | React, Node.js, MongoDB | GitHub: github.com/priyapatel/devplatform
            - Developed a full-stack community portal with markdown blogging, live upvoting, and search.
            - Engineered authentication with JWT and bcrypt, supporting 1,000+ registered student developers.
            - Reduced page load times by 40% using Next.js server-side rendering.

            SmartRecruit - Placement Management System | Python, React, PostgreSQL | GitHub: github.com/priyapatel/smartrecruit
            - Built applicant tracking workflow with automated resume ranking and company job boards.
            - Integrated REST APIs for candidate interview scheduling.

            ACHIEVEMENTS & HONORS
            - Solved 350+ Data Structures problems on LeetCode
            - Finalist at Smart India Hackathon 2023
            """;

    private final String WEAK_INCOMPLETE_RESUME = """
            John
            Skills: Java
            Worked on a small website for college.
            """;

    @BeforeEach
    void setUp() {
        skillTaxonomyEngine = new SkillTaxonomyEngine();
        keywordExtractionEngine = new KeywordExtractionEngine();
        universalEngine = new UniversalAtsIntelligenceEngine(skillTaxonomyEngine);
        jobMatchEngine = new JobMatchIntelligenceEngine(skillTaxonomyEngine, keywordExtractionEngine);
        bulletImprovementEngine = new BulletImprovementEngine(openAIClient, objectMapper);
    }

    @Test
    void testUniversalEngine_StrongExperiencedResume_ProducesHighDeterministicScore() {
        ExtractedResumeContent telemetry = ExtractedResumeContent.builder()
                .extractionStatus(ExtractionStatus.EXCELLENT)
                .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                .confidenceScore(0.98)
                .build();

        UniversalAtsIntelligenceEngine.UniversalAnalysisResult result = universalEngine.analyze(
                STRONG_EXPERIENCED_RESUME, telemetry, "Senior Software Engineer");

        assertNotNull(result);
        assertEquals("ANALYSIS_COMPLETE", result.analysisStatus());
        assertTrue(result.overallScore() >= 85, "Strong experienced resume should score >= 85, got: " + result.overallScore());
        assertTrue(result.scoreLabel().equals("Strong") || result.scoreLabel().equals("Excellent"));
        assertTrue(result.confidence() >= 90, "Confidence should be >= 90%");
        assertEquals(7, result.categories().size(), "Must include all 7 universal categories");
        assertFalse(result.strengths().isEmpty());
    }

    @Test
    void testUniversalEngine_FresherResume_AwardedFairlyWithoutPenalizingZeroCorporateTenure() {
        ExtractedResumeContent telemetry = ExtractedResumeContent.builder()
                .extractionStatus(ExtractionStatus.EXCELLENT)
                .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                .confidenceScore(0.95)
                .build();

        UniversalAtsIntelligenceEngine.UniversalAnalysisResult result = universalEngine.analyze(
                FRESHER_PROJECT_HEAVY_RESUME, telemetry, "Software Engineer");

        assertNotNull(result);
        assertTrue(result.isFresher(), "Should detect candidate as fresher");
        assertTrue(result.overallScore() >= 75, "Fresher with strong projects should score >= 75, got: " + result.overallScore());
        assertTrue(result.scoreLabel().equals("Good Foundation") || result.scoreLabel().equals("Strong") || result.scoreLabel().equals("Excellent"));
    }

    @Test
    void testUniversalEngine_WeakResume_ScoresLowWithActionableIssues() {
        ExtractedResumeContent telemetry = ExtractedResumeContent.builder()
                .extractionStatus(ExtractionStatus.PARTIAL)
                .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                .confidenceScore(0.60)
                .build();

        UniversalAtsIntelligenceEngine.UniversalAnalysisResult result = universalEngine.analyze(
                WEAK_INCOMPLETE_RESUME, telemetry, "Software Engineer");

        assertNotNull(result);
        assertTrue(result.overallScore() < 50, "Weak resume must score < 50, got: " + result.overallScore());
        assertFalse(result.criticalIssues().isEmpty(), "Must list high impact critical issues");
    }

    @Test
    void testUniversalEngine_EmptyOrCorruptText_ReturnsAnalysisUnavailable() {
        UniversalAtsIntelligenceEngine.UniversalAnalysisResult result = universalEngine.analyze(
                "", null, "Software Engineer");

        assertNotNull(result);
        assertEquals("ANALYSIS_UNAVAILABLE", result.analysisStatus());
        assertEquals(0, result.overallScore());
        assertEquals(0, result.confidence());
    }

    @Test
    void testSkillTaxonomy_PreservesSpecialTechnicalTerms() {
        String text = "Expertise in C++, C#, .NET Core, Node.js, React.js, and REST APIs.";
        SkillTaxonomyEngine.ExtractedSkillsResult result = skillTaxonomyEngine.extractSkills(text);

        assertTrue(result.getNormalizedSkills().contains("C++"));
        assertTrue(result.getNormalizedSkills().contains("C#"));
        assertTrue(result.getNormalizedSkills().contains(".NET"));
        assertTrue(result.getNormalizedSkills().contains("Node.js"));
        assertTrue(result.getNormalizedSkills().contains("React"));
        assertTrue(result.getNormalizedSkills().contains("REST APIs"));
    }

    @Test
    void testJobMatchEngine_ClassifiesRequiredVsPreferredSkills() {
        String jdText = """
                Senior Java Engineer
                Required Qualifications:
                - Strong expertise in Java, Spring Boot, Microservices, and PostgreSQL.
                - Hands-on experience with Docker and Kubernetes.
                
                Preferred Qualifications / Nice to Have:
                - Familiarity with Redis, GraphQL, and AWS.
                """;

        JobMatchIntelligenceEngine.JobMatchResult result = jobMatchEngine.evaluate(
                STRONG_EXPERIENCED_RESUME, jdText, "Senior Java Engineer", "TechCorp");

        assertNotNull(result);
        assertTrue(result.jobMatchScore() >= 80, "Strong match should score >= 80, got: " + result.jobMatchScore());
        assertTrue(result.matchedRequiredSkills().contains("Java"));
        assertTrue(result.matchedRequiredSkills().contains("Spring Boot"));
        assertTrue(result.matchedRequiredSkills().contains("Docker"));
        assertTrue(result.matchedPreferredSkills().contains("Redis") || result.matchedPreferredSkills().contains("AWS"));
    }

    @Test
    void testBulletImprovementEngine_EnhancesActionVerbsWithoutFabricatingMetrics() {
        BulletImprovementRequestDto request = BulletImprovementRequestDto.builder()
                .originalBullet("worked on backend api for user management")
                .targetRole("Backend Developer")
                .contextTech("Spring Boot, PostgreSQL")
                .build();

        BulletImprovementResponseDto response = bulletImprovementEngine.improveBullet(request);

        assertNotNull(response);
        assertTrue(response.getImprovedBullet().startsWith("Engineered") || response.getImprovedBullet().startsWith("Architected") || response.getImprovedBullet().startsWith("Developed"));
        assertTrue(response.getImprovedBullet().contains("Spring Boot") || response.getImprovedBullet().contains("backend"));
        assertFalse(response.getMetricsPlaceholderPrompts().isEmpty(), "Should offer guidance questions for real metrics");
    }

    @Test
    void testScoreDeterminism_ProducesIdenticalScoreAcrossMultipleRuns() {
        ExtractedResumeContent telemetry = ExtractedResumeContent.builder()
                .extractionStatus(ExtractionStatus.EXCELLENT)
                .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                .confidenceScore(0.98)
                .build();

        UniversalAtsIntelligenceEngine.UniversalAnalysisResult run1 = universalEngine.analyze(STRONG_EXPERIENCED_RESUME, telemetry, "Software Engineer");
        UniversalAtsIntelligenceEngine.UniversalAnalysisResult run2 = universalEngine.analyze(STRONG_EXPERIENCED_RESUME, telemetry, "Software Engineer");

        assertEquals(run1.overallScore(), run2.overallScore(), "Scores must be strictly deterministic");
        assertEquals(run1.confidence(), run2.confidence(), "Confidence must be strictly deterministic");
        assertEquals(run1.scoreLabel(), run2.scoreLabel());
    }
}
