package com.careeros.ats;

import com.careeros.ats.dto.AtsDetailedResponseDto;
import com.careeros.ats.dto.AtsJobAnalysisRequestDto;
import com.careeros.ats.engine.*;
import com.careeros.ats.entity.AtsAnalysisEntity;
import com.careeros.ats.repository.AtsAnalysisRepository;
import com.careeros.ats.service.AtsAiSuggestionService;
import com.careeros.openai.OpenAIClient;
import com.careeros.resume.ResumeEntity;
import com.careeros.resume.ResumeRepository;
import com.careeros.resume.ResumeService;
import com.careeros.resume.extraction.ExtractionQualityValidator;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AtsAnalysisTest {

    private SkillTaxonomyEngine skillTaxonomyEngine;
    private KeywordExtractionEngine keywordExtractionEngine;
    private DeterministicAtsScorer deterministicAtsScorer;
    private AtsAiSuggestionService atsAiSuggestionService;
    private ExtractionQualityValidator extractionQualityValidator;
    private UniversalAtsIntelligenceEngine universalEngine;
    private JobMatchIntelligenceEngine jobMatchEngine;
    private BulletImprovementEngine bulletImprovementEngine;
    private ATSServiceImpl atsService;

    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private ResumeService resumeService;
    @Mock
    private AtsAnalysisRepository atsAnalysisRepository;
    @Mock
    private OpenAIClient openAIClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String STRONG_RESUME_TEXT = """
            ATUL SHARMA
            Email: atul.sharma@example.com | Phone: +91 9876543210 | Bangalore, India
            GitHub: github.com/atulsharma | LinkedIn: linkedin.com/in/atulsharma | Portfolio: atulsharma.dev

            PROFESSIONAL SUMMARY
            Results-driven Software Engineer with 2+ years of experience developing robust microservices and full-stack web applications using Java, Spring Boot, React, and PostgreSQL.

            EDUCATION
            Bachelor of Technology in Computer Science and Engineering
            National Institute of Technology | 2020 - 2024 | GPA: 8.8 / 10.0

            TECHNICAL SKILLS
            Programming Languages: Java, Python, C++, JavaScript, TypeScript, SQL
            Frameworks & Web: Spring Boot, React.js, Node.js, Express.js, REST APIs, Microservices
            Databases & Tools: PostgreSQL, MySQL, Redis, Docker, Kubernetes, Git, Linux, Postman
            CS Fundamentals: Data Structures, Algorithms, OOP, DBMS, Operating Systems, Computer Networks

            WORK EXPERIENCE
            Software Engineer Intern | TechCorp India | Jan 2024 - Jun 2024
            - Engineered scalable RESTful microservices using Spring Boot and PostgreSQL, serving 50,000+ daily active users.
            - Optimized slow SQL database queries, reducing average API response latency by 35%.
            - Automated deployment pipelines using Docker and GitHub Actions, improving release cycle time by 40%.

            PROJECTS
            CareerOS - AI Placement Platform | Java, Spring Boot, React, PostgreSQL | GitHub: github.com/atulsharma/careeros
            - Developed a full-stack placement portal with JWT authentication, resume parsing, and AI mock interview simulations.
            - Architected microservices with Redis caching, supporting 500+ concurrent requests with 99.9% uptime.
            - Built responsive dashboard with TailwindCSS, Lucide icons, and competitive performance.

            ACHIEVEMENTS & CERTIFICATIONS
            - AWS Certified Cloud Practitioner (2023)
            - 1st Place Winner at National Hackathon 2023 out of 120+ participating engineering teams
            - Solved 450+ Data Structures & Algorithms problems on LeetCode (Top 5% rating)
            """;

    private final String INCOMPLETE_RESUME_TEXT = """
            John Doe
            Skills: Java, HTML
            I worked on a small website for my college.
            """;

    @BeforeEach
    void setUp() {
        skillTaxonomyEngine = new SkillTaxonomyEngine();
        keywordExtractionEngine = new KeywordExtractionEngine();
        deterministicAtsScorer = new DeterministicAtsScorer(skillTaxonomyEngine, keywordExtractionEngine);
        atsAiSuggestionService = new AtsAiSuggestionService(openAIClient, objectMapper);
        extractionQualityValidator = new ExtractionQualityValidator();
        universalEngine = new UniversalAtsIntelligenceEngine(skillTaxonomyEngine);
        jobMatchEngine = new JobMatchIntelligenceEngine(skillTaxonomyEngine, keywordExtractionEngine);
        bulletImprovementEngine = new BulletImprovementEngine(openAIClient, objectMapper);

        atsService = new ATSServiceImpl(
                resumeRepository,
                resumeService,
                atsAnalysisRepository,
                universalEngine,
                jobMatchEngine,
                bulletImprovementEngine,
                deterministicAtsScorer,
                atsAiSuggestionService,
                extractionQualityValidator,
                objectMapper
        );
    }

    @Test
    void testOverallScore_StrongResume_ReturnsDeterministicHighScore() {
        DeterministicAtsScorer.OverallScoreResult result = deterministicAtsScorer.scoreOverallResume(STRONG_RESUME_TEXT);

        assertNotNull(result);
        assertTrue(result.overallScore() >= 75 && result.overallScore() <= 98,
                "Strong complete resume should score in the 75-98 range, got: " + result.overallScore());
        assertTrue(result.readinessLevel().contains("ATS readiness"), "Expected ATS readiness level, got: " + result.readinessLevel());
        assertTrue(result.completenessScore() >= 17, "Completeness should be >= 17/20");
        assertTrue(result.skillsScore() >= 16, "Skills should be >= 16/20");
        assertTrue(result.impactScore() >= 10, "Impact score should be >= 10/15");
        assertFalse(result.strengths().isEmpty());
    }

    @Test
    void testOverallScore_IncompleteResume_ReturnsLowCompletenessScore() {
        DeterministicAtsScorer.OverallScoreResult result = deterministicAtsScorer.scoreOverallResume(INCOMPLETE_RESUME_TEXT);

        assertNotNull(result);
        assertTrue(result.overallScore() < 50, "Weak resume must receive low score, got: " + result.overallScore());
        assertTrue(result.completenessScore() <= 8, "Incomplete resume must have low completeness, got: " + result.completenessScore());
        assertFalse(result.improvements().isEmpty(), "Must provide improvements for missing sections");
    }

    @Test
    void testOverallScore_UnreadableResume_ReturnsHonestFailure() {
        DeterministicAtsScorer.OverallScoreResult result = deterministicAtsScorer.scoreOverallResume("");

        assertNotNull(result);
        assertEquals(0, result.overallScore());
        assertEquals("Needs significant improvement", result.readinessLevel());
        assertFalse(result.warnings().isEmpty());
    }

    @Test
    void testSkillTaxonomy_AliasNormalization_ReactAndReactJsNotDoubleCounted() {
        String text = "Experienced in React, React.js, and ReactJS along with Node.js and NodeJS.";
        SkillTaxonomyEngine.ExtractedSkillsResult result = skillTaxonomyEngine.extractSkills(text);

        Set<String> skills = result.getNormalizedSkills();
        assertTrue(skills.contains("React"));
        assertTrue(skills.contains("Node.js"));
        assertEquals(2, result.getDistinctCount(), "React aliases and Node aliases must not be double counted");
    }

    @Test
    void testSkillTaxonomy_CppAndCPlusPlus_NormalizedCorrectly() {
        String text1 = "Skilled in C++ and Python.";
        String text2 = "Skilled in cpp and python.";
        String text3 = "Skilled in c plus plus and python.";

        Set<String> s1 = skillTaxonomyEngine.extractSkills(text1).getNormalizedSkills();
        Set<String> s2 = skillTaxonomyEngine.extractSkills(text2).getNormalizedSkills();
        Set<String> s3 = skillTaxonomyEngine.extractSkills(text3).getNormalizedSkills();

        assertTrue(s1.contains("C++"));
        assertTrue(s1.contains("Python"));
        assertEquals(s1, s2);
        assertEquals(s1, s3);
    }

    @Test
    void testJobMatch_DifferentJobDescriptions_ProduceDifferentMatchScores() {
        String javaBackendJd = """
                We are hiring a Senior Java Backend Engineer.
                Required Skills:
                - Strong experience with Java, Spring Boot, Microservices, and PostgreSQL.
                - Hands-on with Docker, Kubernetes, and REST APIs.
                - Knowledge of Redis caching and Unit Testing with JUnit.
                """;

        String iosSwiftJd = """
                We are hiring an iOS Mobile Developer.
                Requirements:
                - 3+ years experience with Swift and SwiftUI.
                - iOS SDK, CoreData, Xcode, CocoaPods.
                - Mobile UI/UX and App Store deployment.
                """;

        DeterministicAtsScorer.JobMatchResult matchJava = deterministicAtsScorer.scoreJobMatch(STRONG_RESUME_TEXT, javaBackendJd);
        DeterministicAtsScorer.JobMatchResult matchIos = deterministicAtsScorer.scoreJobMatch(STRONG_RESUME_TEXT, iosSwiftJd);

        assertNotNull(matchJava);
        assertNotNull(matchIos);
        assertTrue(matchJava.jobMatchScore() > matchIos.jobMatchScore() + 25,
                "Java candidate must score significantly higher on Java JD than on iOS JD. Java: "
                        + matchJava.jobMatchScore() + ", iOS: " + matchIos.jobMatchScore());
        assertTrue(matchJava.matchedSkills().contains("Java"));
        assertTrue(matchJava.matchedSkills().contains("Spring Boot"));
        assertTrue(matchIos.missingSkills().contains("Swift"));
    }

    @Test
    void testJobMatch_MissingSkills_IdentifiedCorrectlyWithoutNegativeFraming() {
        String jdWithMissingCloud = """
                Software Engineer
                Requirements: Java, Python, AWS, Docker, Kubernetes, Kafka, Terraform
                """;

        DeterministicAtsScorer.JobMatchResult result = deterministicAtsScorer.scoreJobMatch(STRONG_RESUME_TEXT, jdWithMissingCloud);

        assertTrue(result.matchedSkills().contains("Java"));
        assertTrue(result.matchedSkills().contains("Python"));
        assertTrue(result.matchedSkills().contains("Docker"));
        assertTrue(result.missingSkills().contains("Kafka") || result.missingSkills().contains("Terraform"));
    }

    @Test
    void testAtsAnalysisService_UnauthorizedUser_ThrowsAccessDeniedException() {
        ResumeEntity resume = new ResumeEntity();
        resume.setId(10L);
        resume.setUserId(99L); // Owner is user 99
        resume.setExtractedText(STRONG_RESUME_TEXT);

        when(resumeRepository.findById(10L)).thenReturn(Optional.of(resume));

        assertThrows(AccessDeniedException.class, () -> {
            atsService.getOverallAnalysis(10L, 100L); // Requesting user is 100
        });
    }

    @Test
    void testAiSuggestionService_WhenAiFails_GracefullyFallsBackToDeterministicSuggestions() {
        when(openAIClient.executeChatCompletion(any(), any(), anyDouble()))
                .thenThrow(new RuntimeException("OpenAI quota exceeded"));

        List<String> defaultSuggestions = List.of("Add measurable metrics to projects.", "Incorporate missing AWS skills.");
        List<String> suggestions = atsAiSuggestionService.generateContextualSuggestions(
                75, 80, List.of("Java"), List.of("AWS"), List.of(), defaultSuggestions
        );

        assertNotNull(suggestions);
        assertEquals(2, suggestions.size());
        assertEquals("Add measurable metrics to projects.", suggestions.get(0));
    }

    @Test
    void testGetUniversalIntelligence_WithSpacedRoleAndNullHistory_Succeeds() {
        ResumeEntity resume = new ResumeEntity();
        resume.setId(2L);
        resume.setUserId(100L);
        resume.setFileType("pdf");
        resume.setExtractedText(STRONG_RESUME_TEXT);

        when(resumeRepository.findById(2L)).thenReturn(Optional.of(resume));
        when(resumeService.healExtractedTextIfNecessary(any())).thenReturn(resume);
        when(atsAnalysisRepository.findTop2ByResumeIdAndAnalysisModeOrderByCreatedAtDesc(2L, "UNIVERSAL"))
                .thenReturn(List.of());

        AtsAnalysisEntity savedMock = AtsAnalysisEntity.builder()
                .id(55L)
                .resumeId(2L)
                .userId(100L)
                .overallScore(88)
                .scoreLabel("Strong")
                .createdAt(LocalDateTime.now())
                .build();
        when(atsAnalysisRepository.save(any(AtsAnalysisEntity.class))).thenReturn(savedMock);

        var result = atsService.getUniversalIntelligence(2L, 100L, "Software Engineer");

        assertNotNull(result);
        assertEquals("55", result.getAnalysisId());
        assertEquals(2L, result.getResumeId());
        assertEquals("Software Engineer", result.getTargetRole());
        assertTrue(result.getOverallScore() >= 75);
    }

    @Test
    void testGetResumeAnalysisHistory_WhenEmpty_ReturnsEmptyList() {
        ResumeEntity resume = new ResumeEntity();
        resume.setId(2L);
        resume.setUserId(100L);
        resume.setExtractedText(STRONG_RESUME_TEXT);

        when(resumeRepository.findById(2L)).thenReturn(Optional.of(resume));
        when(atsAnalysisRepository.findByResumeIdOrderByCreatedAtDesc(2L)).thenReturn(List.of());

        var history = atsService.getResumeAnalysisHistory(2L, 100L);

        assertNotNull(history);
        assertTrue(history.isEmpty());
    }

    @Test
    void testGetResumeAnalysisHistory_WithNullFieldEntities_MapsGracefully() {
        ResumeEntity resume = new ResumeEntity();
        resume.setId(2L);
        resume.setUserId(100L);
        resume.setExtractedText(STRONG_RESUME_TEXT);

        when(resumeRepository.findById(2L)).thenReturn(Optional.of(resume));

        AtsAnalysisEntity legacyEntity = new AtsAnalysisEntity();
        legacyEntity.setId(10L);
        legacyEntity.setResumeId(2L);
        legacyEntity.setUserId(100L);
        legacyEntity.setAnalysisMode("UNIVERSAL");
        // All score and string fields are null
        when(atsAnalysisRepository.findByResumeIdOrderByCreatedAtDesc(2L)).thenReturn(List.of(legacyEntity));

        var history = atsService.getResumeAnalysisHistory(2L, 100L);

        assertNotNull(history);
        assertEquals(1, history.size());
        assertEquals(0, history.get(0).getOverallScore());
        assertEquals("Standard", history.get(0).getScoreLabel());
    }
}
