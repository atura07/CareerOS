package com.careeros.dashboard;

import com.careeros.application.ApplicationEntity;
import com.careeros.application.ApplicationRepository;
import com.careeros.ats.AtsAnalyzer;
import com.careeros.ats.AtsResponse;
import com.careeros.company.UserCompanyPrepRepository;
import com.careeros.company.UserCompanyPreparationEntity;
import com.careeros.dashboard.dto.DashboardSummaryDto;
import com.careeros.interview.InterviewSessionEntity;
import com.careeros.interview.InterviewSessionRepository;
import com.careeros.resume.ResumeEntity;
import com.careeros.resume.ResumeRepository;
import com.careeros.roadmap.RoadmapEntity;
import com.careeros.roadmap.RoadmapRepository;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ResumeRepository resumeRepository;
    @Mock
    private AtsAnalyzer atsAnalyzer;
    @Mock
    private InterviewSessionRepository interviewSessionRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private UserCompanyPrepRepository userCompanyPrepRepository;
    @Mock
    private RoadmapRepository roadmapRepository;

    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
        dashboardService = new DashboardServiceImpl(
                userRepository,
                resumeRepository,
                atsAnalyzer,
                interviewSessionRepository,
                applicationRepository,
                userCompanyPrepRepository,
                roadmapRepository
        );
    }

    @Test
    void testNewUser_ZeroData_ReturnsHonestNotEnoughData() {
        User user = new User();
        user.setId(100L);
        user.setFullName("Atul Sharma");
        user.setEmail("atul@example.com");

        when(userRepository.findById(100L)).thenReturn(Optional.of(user));
        when(resumeRepository.findByUserIdOrderByUploadDateDesc(100L)).thenReturn(Collections.emptyList());
        when(interviewSessionRepository.findByUserIdOrderByStartedAtDesc(100L)).thenReturn(Collections.emptyList());
        when(applicationRepository.findByUserIdOrderByLastUpdatedDesc(100L)).thenReturn(Collections.emptyList());
        when(userCompanyPrepRepository.findByUserId(100L)).thenReturn(Collections.emptyList());
        when(roadmapRepository.findByUserIdOrderByCreatedAtDesc(100L)).thenReturn(Collections.emptyList());

        DashboardSummaryDto summary = dashboardService.getDashboardSummary(100L);

        assertNotNull(summary);
        assertEquals("Atul", summary.getGreeting().getName());
        assertFalse(summary.getPlacementReadiness().isAvailable(), "Readiness must NOT be available for brand new user");
        assertNull(summary.getPlacementReadiness().getScore(), "Score must be null when insufficient data");
        assertEquals("NOT_ENOUGH_DATA", summary.getPlacementReadiness().getStatus());
        assertEquals("NOT_UPLOADED", summary.getJourney().getResume().getState());
        assertEquals("NOT_ATTEMPTED", summary.getJourney().getMockInterview().getState());
        assertEquals("EMPTY", summary.getJourney().getApplications().getState());
        assertTrue(summary.getRecentActivity().isEmpty(), "Recent activity must be empty for new user");
        assertFalse(summary.getNextActions().isEmpty(), "Must provide prioritized next actions");
        assertEquals("act-resume", summary.getNextActions().get(0).getId(), "First action must be upload resume");
    }

    @Test
    void testPartialUser_ResumeOnly_ReturnsHonestMetricsAndPrioritizedNextActions() {
        User user = new User();
        user.setId(100L);
        user.setFullName("Priya Patel");
        user.setEmail("priya@example.com");

        ResumeEntity resume = new ResumeEntity();
        resume.setId(5L);
        resume.setUserId(100L);
        resume.setOriginalFileName("Priya_Resume.pdf");
        resume.setExtractedText("Full Stack Developer with React and Node experience");
        resume.setUploadDate(LocalDateTime.now().minusDays(1));

        AtsResponse ats = new AtsResponse();
        ats.setOverallScore(78);

        when(userRepository.findById(100L)).thenReturn(Optional.of(user));
        when(resumeRepository.findByUserIdOrderByUploadDateDesc(100L)).thenReturn(List.of(resume));
        when(atsAnalyzer.analyze(any())).thenReturn(ats);
        when(interviewSessionRepository.findByUserIdOrderByStartedAtDesc(100L)).thenReturn(Collections.emptyList());
        when(applicationRepository.findByUserIdOrderByLastUpdatedDesc(100L)).thenReturn(Collections.emptyList());
        when(userCompanyPrepRepository.findByUserId(100L)).thenReturn(Collections.emptyList());
        when(roadmapRepository.findByUserIdOrderByCreatedAtDesc(100L)).thenReturn(Collections.emptyList());

        DashboardSummaryDto summary = dashboardService.getDashboardSummary(100L);

        assertNotNull(summary);
        assertEquals("Priya", summary.getGreeting().getName());
        assertFalse(summary.getPlacementReadiness().isAvailable(), "Readiness must require >= 2 milestones");
        assertEquals("ANALYZED", summary.getJourney().getResume().getState());
        assertEquals("ATS Score: 78/100", summary.getJourney().getResume().getPrimaryMetric());
        assertEquals("NOT_ATTEMPTED", summary.getJourney().getMockInterview().getState());
        assertEquals("EMPTY", summary.getJourney().getApplications().getState());
        assertEquals(1, summary.getRecentActivity().size());
        assertEquals("Resume Uploaded", summary.getRecentActivity().get(0).getTitle());
    }

    @Test
    void testActiveUser_WithRealData_CalculatesReadinessAndActivity() {
        User user = new User();
        user.setId(100L);
        user.setFullName("Atul Sharma");
        user.setEmail("atul@example.com");
        user.setEmailVerified(true);

        ResumeEntity resume = new ResumeEntity();
        resume.setId(1L);
        resume.setUserId(100L);
        resume.setOriginalFileName("Atul_Resume_SDE.pdf");
        resume.setExtractedText("Experienced Java and Spring Boot developer with PostgreSQL skills");
        resume.setUploadDate(LocalDateTime.now().minusDays(2));

        AtsResponse ats = new AtsResponse();
        ats.setOverallScore(82);

        InterviewSessionEntity interview = new InterviewSessionEntity();
        interview.setId(10L);
        interview.setUserId(100L);
        interview.setCompanyName("Google");
        interview.setRoleTitle("Software Engineer");
        interview.setDifficulty("Medium");
        interview.setStatus("COMPLETED");
        interview.setOverallScore(86);
        interview.setStartedAt(LocalDateTime.now().minusDays(1));
        interview.setEndedAt(LocalDateTime.now().minusDays(1));

        ApplicationEntity app = new ApplicationEntity();
        app.setId(5L);
        app.setUserId(100L);
        app.setCompanyName("Amazon");
        app.setRole("SDE-1");
        app.setStatus("OA Scheduled");
        app.setCreatedAt(LocalDateTime.now().minusDays(3));

        UserCompanyPreparationEntity prep = new UserCompanyPreparationEntity();
        prep.setId(2L);
        prep.setUserId(100L);
        prep.setProgressPercentage(50);

        when(userRepository.findById(100L)).thenReturn(Optional.of(user));
        when(resumeRepository.findByUserIdOrderByUploadDateDesc(100L)).thenReturn(List.of(resume));
        when(atsAnalyzer.analyze(any())).thenReturn(ats);
        when(interviewSessionRepository.findByUserIdOrderByStartedAtDesc(100L)).thenReturn(List.of(interview));
        when(applicationRepository.findByUserIdOrderByLastUpdatedDesc(100L)).thenReturn(List.of(app));
        when(userCompanyPrepRepository.findByUserId(100L)).thenReturn(List.of(prep));
        when(roadmapRepository.findByUserIdOrderByCreatedAtDesc(100L)).thenReturn(Collections.emptyList());

        DashboardSummaryDto summary = dashboardService.getDashboardSummary(100L);

        assertNotNull(summary);
        assertTrue(summary.getPlacementReadiness().isAvailable(), "Readiness must be available for active user");
        assertNotNull(summary.getPlacementReadiness().getScore());
        assertTrue(summary.getPlacementReadiness().getScore() >= 50, "Score should reflect verified real activity");
        assertEquals("ANALYZED", summary.getJourney().getResume().getState());
        assertEquals("COMPLETED", summary.getJourney().getMockInterview().getState());
        assertEquals("ACTIVE", summary.getJourney().getApplications().getState());
        assertFalse(summary.getRecentActivity().isEmpty(), "Recent activity must contain real user events");
        assertEquals(3, summary.getRecentActivity().size());
    }

    @Test
    void testFaultTolerance_WhenRepositoriesThrowExceptions_ReturnsCleanEmptyStateWithoutCrashing() {
        when(userRepository.findById(100L)).thenThrow(new RuntimeException("Database timeout"));
        when(resumeRepository.findByUserIdOrderByUploadDateDesc(100L)).thenThrow(new RuntimeException("Table missing"));
        when(interviewSessionRepository.findByUserIdOrderByStartedAtDesc(100L)).thenThrow(new RuntimeException("Connection error"));
        when(applicationRepository.findByUserIdOrderByLastUpdatedDesc(100L)).thenThrow(new RuntimeException("Query failure"));
        when(userCompanyPrepRepository.findByUserId(100L)).thenThrow(new RuntimeException("JPA error"));
        when(roadmapRepository.findByUserIdOrderByCreatedAtDesc(100L)).thenThrow(new RuntimeException("Timeout"));

        DashboardSummaryDto summary = dashboardService.getDashboardSummary(100L);

        assertNotNull(summary, "Dashboard summary must never be null even on database error");
        assertEquals("Candidate", summary.getGreeting().getName());
        assertFalse(summary.getPlacementReadiness().isAvailable());
        assertEquals("NOT_ENOUGH_DATA", summary.getPlacementReadiness().getStatus());
        assertNotNull(summary.getJourney());
        assertNotNull(summary.getNextActions());
        assertNotNull(summary.getRecentActivity());
    }
}
