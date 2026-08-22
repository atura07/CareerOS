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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final AtsAnalyzer atsAnalyzer;
    private final InterviewSessionRepository interviewSessionRepository;
    private final ApplicationRepository applicationRepository;
    private final UserCompanyPrepRepository userCompanyPrepRepository;
    private final RoadmapRepository roadmapRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary(Long userId) {
        log.info("[DASHBOARD] Fetching real summary for userId={}", userId);

        User user = null;
        try {
            user = userRepository.findById(userId).orElse(null);
        } catch (Exception e) {
            log.warn("[DASHBOARD] Failed to query user by id={}: {}", userId, e.getMessage());
        }

        String fullName = user != null && user.getFullName() != null && !user.getFullName().isBlank()
                ? user.getFullName()
                : "Candidate";
        String firstName = fullName.contains(" ") ? fullName.split(" ")[0] : fullName;

        // 1. Fetch real entity data with individual resilience
        List<ResumeEntity> resumes = safeFetchResumes(userId);
        List<InterviewSessionEntity> sessions = safeFetchInterviews(userId);
        List<ApplicationEntity> applications = safeFetchApplications(userId);
        List<UserCompanyPreparationEntity> companyPreps = safeFetchCompanyPreps(userId);
        List<RoadmapEntity> roadmaps = safeFetchRoadmaps(userId);

        boolean hasResume = !resumes.isEmpty();
        ResumeEntity latestResume = hasResume ? resumes.get(0) : null;
        Integer atsScore = null;

        if (latestResume != null && latestResume.getExtractedText() != null && !latestResume.getExtractedText().isBlank()) {
            try {
                AtsResponse atsResponse = atsAnalyzer.analyze(latestResume.getExtractedText());
                if (atsResponse != null) {
                    atsScore = atsResponse.getOverallScore();
                }
            } catch (Exception e) {
                log.warn("[DASHBOARD] Could not compute ATS score for resume id={}: {}", latestResume.getId(), e.getMessage());
            }
        }

        List<InterviewSessionEntity> completedSessions = sessions.stream()
                .filter(s -> s != null && "COMPLETED".equalsIgnoreCase(s.getStatus()))
                .collect(Collectors.toList());
        boolean hasInterview = !completedSessions.isEmpty();
        InterviewSessionEntity latestCompletedInterview = hasInterview ? completedSessions.get(0) : null;

        boolean hasApplications = !applications.isEmpty();
        long activeAppsCount = applications.stream()
                .filter(a -> a != null && a.getStatus() != null && !"Rejected".equalsIgnoreCase(a.getStatus()) && !"Offer".equalsIgnoreCase(a.getStatus()))
                .count();
        long offersCount = applications.stream()
                .filter(a -> a != null && "Offer".equalsIgnoreCase(a.getStatus()))
                .count();

        boolean hasCompanyPrep = !companyPreps.isEmpty();
        int completedTasksTotal = 0;
        int tasksTotal = 0;
        for (UserCompanyPreparationEntity cp : companyPreps) {
            if (cp == null) continue;
            try {
                if (cp.getTasks() != null && !cp.getTasks().isEmpty()) {
                    tasksTotal += cp.getTasks().size();
                    completedTasksTotal += (int) cp.getTasks().stream()
                            .filter(t -> t != null && "COMPLETED".equalsIgnoreCase(t.getStatus()))
                            .count();
                } else if (cp.getProgressPercentage() != null && cp.getProgressPercentage() > 0) {
                    completedTasksTotal += 1;
                    tasksTotal += 1;
                }
            } catch (Exception e) {
                if (cp.getProgressPercentage() != null && cp.getProgressPercentage() > 0) {
                    completedTasksTotal += 1;
                    tasksTotal += 1;
                }
            }
        }

        boolean hasRoadmap = !roadmaps.isEmpty();

        // 2. Greeting
        DashboardSummaryDto.GreetingDto greeting = DashboardSummaryDto.GreetingDto.builder()
                .name(firstName)
                .timeGreeting(determineTimeGreeting())
                .subtitle("Let's build your placement profile step by step.")
                .build();

        // 3. Placement Readiness Calculation (Honest, Fully Data-Driven & Explainable)
        DashboardSummaryDto.PlacementReadinessDto readiness = calculatePlacementReadiness(
                hasResume, atsScore, completedSessions, companyPreps, completedTasksTotal, tasksTotal, applications, activeAppsCount, hasRoadmap
        );

        // 4. Journey Status Cards (5 Pillars with honest state & correct pluralization)
        DashboardSummaryDto.JourneyStatusDto journey = buildJourneyStatus(
                latestResume, atsScore, completedSessions, companyPreps, completedTasksTotal, applications, activeAppsCount, offersCount
        );

        // 5. Dynamic Next Actions
        List<DashboardSummaryDto.NextActionDto> nextActions = buildNextActions(
                hasResume, atsScore, hasInterview, hasCompanyPrep, hasApplications, hasRoadmap, latestResume, latestCompletedInterview
        );

        // 6. Recent Activity (strictly deduplicated and chronological)
        List<DashboardSummaryDto.RecentActivityDto> recentActivity = buildRecentActivity(
                resumes, completedSessions, applications, companyPreps, roadmaps
        );

        // 7. Profile Completion
        DashboardSummaryDto.ProfileCompletionDto profileCompletion = buildProfileCompletion(
                user, hasResume, hasInterview, hasCompanyPrep, hasApplications
        );

        // 8. Consistency & Motivation
        DashboardSummaryDto.ConsistencyDto consistency = DashboardSummaryDto.ConsistencyDto.builder()
                .activeDaysCount(recentActivity.size())
                .message(hasInterview || hasResume
                        ? "Great job building your career profile! Consistent preparation is key to clearing placements."
                        : "Start your journey today by uploading your resume or taking your first AI mock interview.")
                .quote("“Success is the sum of small efforts, repeated day in and day out.”")
                .ctaLabel(hasRoadmap ? "View Active Roadmap" : "Generate 60-Day Roadmap")
                .ctaLink("/dashboard/roadmap")
                .build();

        return DashboardSummaryDto.builder()
                .greeting(greeting)
                .placementReadiness(readiness)
                .journey(journey)
                .nextActions(nextActions)
                .recentActivity(recentActivity)
                .profileCompletion(profileCompletion)
                .consistency(consistency)
                .build();
    }

    private List<ResumeEntity> safeFetchResumes(Long userId) {
        try {
            return resumeRepository.findByUserIdOrderByUploadDateDesc(userId);
        } catch (Exception e) {
            log.warn("[DASHBOARD] Error fetching resumes for userId={}: {}", userId, e.getMessage());
            try {
                return resumeRepository.findByUserId(userId);
            } catch (Exception ignored) {
                return Collections.emptyList();
            }
        }
    }

    private List<InterviewSessionEntity> safeFetchInterviews(Long userId) {
        try {
            return interviewSessionRepository.findByUserIdOrderByStartedAtDesc(userId);
        } catch (Exception e) {
            log.warn("[DASHBOARD] Error fetching interviews for userId={}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<ApplicationEntity> safeFetchApplications(Long userId) {
        try {
            return applicationRepository.findByUserIdOrderByLastUpdatedDesc(userId);
        } catch (Exception e) {
            log.warn("[DASHBOARD] Error fetching applications for userId={}: {}", userId, e.getMessage());
            try {
                return applicationRepository.findByUserId(userId);
            } catch (Exception ignored) {
                return Collections.emptyList();
            }
        }
    }

    private List<UserCompanyPreparationEntity> safeFetchCompanyPreps(Long userId) {
        try {
            return userCompanyPrepRepository.findByUserId(userId);
        } catch (Exception e) {
            log.warn("[DASHBOARD] Error fetching company preps for userId={}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<RoadmapEntity> safeFetchRoadmaps(Long userId) {
        try {
            return roadmapRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } catch (Exception e) {
            log.warn("[DASHBOARD] Error fetching roadmaps for userId={}: {}", userId, e.getMessage());
            return Collections.emptyList();
        }
    }

    private String determineTimeGreeting() {
        int hour = java.time.LocalTime.now().getHour();
        if (hour >= 5 && hour < 12) {
            return "Good morning";
        } else if (hour >= 12 && hour < 17) {
            return "Good afternoon";
        } else {
            return "Good evening";
        }
    }

    private DashboardSummaryDto.PlacementReadinessDto calculatePlacementReadiness(
            boolean hasResume, Integer atsScore, List<InterviewSessionEntity> completedSessions,
            List<UserCompanyPreparationEntity> companyPreps, int completedTasksTotal, int tasksTotal,
            List<ApplicationEntity> applications, long activeAppsCount, boolean hasRoadmap) {

        int completedMilestones = 0;
        List<String> requiredMilestones = new ArrayList<>();

        if (hasResume) {
            completedMilestones++;
        } else {
            requiredMilestones.add("Upload Master Resume");
        }

        if (!completedSessions.isEmpty()) {
            completedMilestones++;
        } else {
            requiredMilestones.add("Complete an AI Mock Interview");
        }

        if (!companyPreps.isEmpty()) {
            completedMilestones++;
        } else {
            requiredMilestones.add("Start a Company Preparation Track");
        }

        if (!applications.isEmpty()) {
            completedMilestones++;
        } else {
            requiredMilestones.add("Track Active Applications");
        }

        int totalMilestones = 4;

        // Calculate real weighted category scores (Total Max = 100)
        // 1. Resume & ATS Component (Max 25 pts)
        double resumePts = 0.0;
        String resumeStatusText;
        if (hasResume) {
            resumePts += 10.0;
            if (atsScore != null && atsScore > 0) {
                resumePts += (Math.min(100, atsScore) / 100.0) * 15.0;
                resumeStatusText = "ATS Score: " + atsScore + "/100 (+" + Math.round(resumePts) + " pts)";
            } else {
                resumePts += 5.0;
                resumeStatusText = "Resume uploaded without ATS score (+15 pts)";
            }
        } else {
            resumeStatusText = "No resume uploaded (+0 pts)";
        }

        // 2. Mock Interview Performance (Max 35 pts)
        double interviewPts = 0.0;
        String interviewStatusText;
        if (!completedSessions.isEmpty()) {
            InterviewSessionEntity latest = completedSessions.get(0);
            int interviewScore = latest.getOverallScore() != null ? latest.getOverallScore() : 70;
            interviewPts = (Math.min(100, interviewScore) / 100.0) * 30.0 + (completedSessions.size() > 1 ? 5.0 : 2.5);
            int intCount = completedSessions.size();
            interviewStatusText = intCount + " " + (intCount == 1 ? "interview completed" : "interviews completed")
                    + " (Latest: " + interviewScore + "/100, +" + Math.round(interviewPts) + " pts)";
        } else {
            interviewStatusText = "No completed mock interviews (+0 pts)";
        }

        // 3. Company Prep & Topics (Max 20 pts)
        double prepPts = 0.0;
        String prepStatusText;
        if (!companyPreps.isEmpty()) {
            prepPts += 6.0;
            if (tasksTotal > 0) {
                prepPts += ((double) completedTasksTotal / tasksTotal) * 10.0;
            }
            if (hasRoadmap) {
                prepPts += 4.0;
            }
            int trackCount = companyPreps.size();
            prepStatusText = trackCount + " " + (trackCount == 1 ? "company track" : "company tracks") + ", "
                    + completedTasksTotal + " " + (completedTasksTotal == 1 ? "topic mastered" : "topics mastered")
                    + " (+" + Math.round(prepPts) + " pts)";
        } else if (hasRoadmap) {
            prepPts += 8.0;
            prepStatusText = "Custom roadmap generated (+8 pts)";
        } else {
            prepStatusText = "No company tracks or roadmap started (+0 pts)";
        }

        // 4. Job Applications & Pipeline (Max 20 pts)
        double appPts = 0.0;
        String appStatusText;
        if (!applications.isEmpty()) {
            appPts += Math.min(10.0, applications.size() * 3.0);
            long interviewStages = applications.stream()
                    .filter(a -> a != null && a.getStatus() != null && (a.getStatus().contains("Interview") || a.getStatus().contains("OA") || a.getStatus().contains("Offer")))
                    .count();
            appPts += Math.min(10.0, interviewStages * 4.0);
            int appCount = applications.size();
            appStatusText = appCount + " " + (appCount == 1 ? "application tracked" : "applications tracked")
                    + " (" + activeAppsCount + " active, +" + Math.round(appPts) + " pts)";
        } else {
            appStatusText = "No job applications tracked (+0 pts)";
        }

        List<DashboardSummaryDto.ScoreCategoryDto> breakdown = List.of(
                DashboardSummaryDto.ScoreCategoryDto.builder()
                        .category("Resume & ATS Analysis")
                        .earnedScore((int) Math.round(Math.min(25.0, resumePts)))
                        .maxScore(25)
                        .statusText(resumeStatusText)
                        .icon("FileText")
                        .build(),
                DashboardSummaryDto.ScoreCategoryDto.builder()
                        .category("Mock Interview Performance")
                        .earnedScore((int) Math.round(Math.min(35.0, interviewPts)))
                        .maxScore(35)
                        .statusText(interviewStatusText)
                        .icon("Mic")
                        .build(),
                DashboardSummaryDto.ScoreCategoryDto.builder()
                        .category("Company & Topic Prep")
                        .earnedScore((int) Math.round(Math.min(20.0, prepPts)))
                        .maxScore(20)
                        .statusText(prepStatusText)
                        .icon("Building2")
                        .build(),
                DashboardSummaryDto.ScoreCategoryDto.builder()
                        .category("Job Applications Pipeline")
                        .earnedScore((int) Math.round(Math.min(20.0, appPts)))
                        .maxScore(20)
                        .statusText(appStatusText)
                        .icon("Briefcase")
                        .build()
        );

        // If user has completed fewer than 2 core milestones, honest "NOT_ENOUGH_DATA" state
        if (completedMilestones < 2) {
            return DashboardSummaryDto.PlacementReadinessDto.builder()
                    .available(false)
                    .score(null)
                    .status("NOT_ENOUGH_DATA")
                    .statusLabel("Not Enough Data Yet")
                    .message("Complete at least 2 placement activities (such as uploading your resume or taking an AI mock interview) to unlock your readiness score.")
                    .requiredMilestones(requiredMilestones)
                    .completedMilestonesCount(completedMilestones)
                    .totalMilestonesCount(totalMilestones)
                    .strongestArea(hasResume ? "Resume on File" : (!completedSessions.isEmpty() ? "Interview Practice" : null))
                    .areaNeedingAttention(requiredMilestones.isEmpty() ? null : requiredMilestones.get(0))
                    .recommendedNextAction(requiredMilestones.isEmpty() ? "Practice more interview questions" : requiredMilestones.get(0))
                    .breakdown(breakdown)
                    .build();
        }

        double scoreTotal = resumePts + interviewPts + prepPts + appPts;
        int finalScore = (int) Math.round(Math.min(100.0, Math.max(15.0, scoreTotal)));

        String status;
        String statusLabel;
        if (finalScore >= 80) {
            status = "INTERVIEW_READY";
            statusLabel = "Interview Ready";
        } else if (finalScore >= 65) {
            status = "DEVELOPING";
            statusLabel = "Developing Profile";
        } else if (finalScore >= 45) {
            status = "BUILDING_MOMENTUM";
            statusLabel = "Building Momentum";
        } else {
            status = "GETTING_STARTED";
            statusLabel = "Getting Started";
        }

        // Determine strongest and focus areas based on real data
        String strongestArea = "Resume & Profile";
        if (interviewPts > resumePts && interviewPts > prepPts) {
            strongestArea = "Mock Interview Performance";
        } else if (prepPts > resumePts && prepPts > interviewPts) {
            strongestArea = "Company Topic Preparation";
        } else if (appPts > resumePts && appPts > interviewPts) {
            strongestArea = "Active Applications Pipeline";
        }

        String areaNeedingAttention = "Mock Interviews";
        if (completedSessions.isEmpty()) {
            areaNeedingAttention = "Mock Interview Practice";
        } else if (companyPreps.isEmpty()) {
            areaNeedingAttention = "Company Question Preparation";
        } else if (applications.isEmpty()) {
            areaNeedingAttention = "Job Applications Pipeline";
        } else if (atsScore != null && atsScore < 70) {
            areaNeedingAttention = "Resume Keyword Optimization";
        }

        return DashboardSummaryDto.PlacementReadinessDto.builder()
                .available(true)
                .score(finalScore)
                .status(status)
                .statusLabel(statusLabel)
                .message("Calculated based on your verified resume, mock interview performance, topic preparation, and applications.")
                .requiredMilestones(requiredMilestones)
                .completedMilestonesCount(completedMilestones)
                .totalMilestonesCount(totalMilestones)
                .strongestArea(strongestArea)
                .areaNeedingAttention(areaNeedingAttention)
                .recommendedNextAction(requiredMilestones.isEmpty() ? "Take an advanced mock interview" : requiredMilestones.get(0))
                .breakdown(breakdown)
                .build();
    }

    private DashboardSummaryDto.JourneyStatusDto buildJourneyStatus(
            ResumeEntity latestResume, Integer atsScore, List<InterviewSessionEntity> completedSessions,
            List<UserCompanyPreparationEntity> companyPreps, int completedTasksTotal,
            List<ApplicationEntity> applications, long activeAppsCount, long offersCount) {

        // 1. Resume
        DashboardSummaryDto.CardStatus resumeCard;
        if (latestResume == null) {
            resumeCard = DashboardSummaryDto.CardStatus.builder()
                    .key("resume")
                    .title("Resume & ATS")
                    .state("NOT_UPLOADED")
                    .stateLabel("Not Uploaded")
                    .primaryMetric("No Resume on File")
                    .subtitle("Upload PDF or DOCX")
                    .ctaLabel("Upload Resume")
                    .ctaLink("/dashboard/resume")
                    .isCompleted(false)
                    .build();
        } else {
            String metric = atsScore != null ? ("ATS Score: " + atsScore + "/100") : "Resume Uploaded";
            String fileName = latestResume.getOriginalFileName() != null ? latestResume.getOriginalFileName() : "Resume File";
            resumeCard = DashboardSummaryDto.CardStatus.builder()
                    .key("resume")
                    .title("Resume & ATS")
                    .state(atsScore != null ? "ANALYZED" : "UPLOADED")
                    .stateLabel(atsScore != null ? "Analyzed" : "Uploaded")
                    .primaryMetric(metric)
                    .subtitle(fileName)
                    .ctaLabel("View & Optimize")
                    .ctaLink("/dashboard/resume")
                    .isCompleted(true)
                    .build();
        }

        // 2. DSA / Company Prep
        DashboardSummaryDto.CardStatus dsaCard;
        if (companyPreps.isEmpty()) {
            dsaCard = DashboardSummaryDto.CardStatus.builder()
                    .key("dsa")
                    .title("Company Prep")
                    .state("NOT_ATTEMPTED")
                    .stateLabel("No Tracks Active")
                    .primaryMetric("0 Topics Mastered")
                    .subtitle("Target company question sets")
                    .ctaLabel("Explore Companies")
                    .ctaLink("/dashboard/companies")
                    .isCompleted(false)
                    .build();
        } else {
            int trackCount = companyPreps.size();
            String topicMetric = completedTasksTotal + " " + (completedTasksTotal == 1 ? "Topic Mastered" : "Topics Mastered");
            dsaCard = DashboardSummaryDto.CardStatus.builder()
                    .key("dsa")
                    .title("Company Prep")
                    .state("IN_PROGRESS")
                    .stateLabel(trackCount + " " + (trackCount == 1 ? "Company Track" : "Company Tracks"))
                    .primaryMetric(topicMetric)
                    .subtitle("Targeted placement prep")
                    .ctaLabel("Continue Prep")
                    .ctaLink("/dashboard/companies")
                    .isCompleted(completedTasksTotal > 0)
                    .build();
        }

        // 3. Mock Interview
        DashboardSummaryDto.CardStatus interviewCard;
        if (completedSessions.isEmpty()) {
            interviewCard = DashboardSummaryDto.CardStatus.builder()
                    .key("interview")
                    .title("Mock Interview")
                    .state("NOT_ATTEMPTED")
                    .stateLabel("Not Attempted")
                    .primaryMetric("0 Completed")
                    .subtitle("Real conversational simulation")
                    .ctaLabel("Start Interview")
                    .ctaLink("/dashboard/interview")
                    .isCompleted(false)
                    .build();
        } else {
            InterviewSessionEntity latest = completedSessions.get(0);
            String scoreStr = latest.getOverallScore() != null ? ("Latest Score: " + latest.getOverallScore() + "/100") : "Report Available";
            String compName = latest.getCompanyName() != null ? latest.getCompanyName() : "Placement Practice";
            int sessionCount = completedSessions.size();
            interviewCard = DashboardSummaryDto.CardStatus.builder()
                    .key("interview")
                    .title("Mock Interview")
                    .state("COMPLETED")
                    .stateLabel(sessionCount + " " + (sessionCount == 1 ? "Interview Completed" : "Interviews Completed"))
                    .primaryMetric(scoreStr)
                    .subtitle(compName)
                    .ctaLabel("Take Another")
                    .ctaLink("/dashboard/interview")
                    .isCompleted(true)
                    .build();
        }

        // 4. GitHub Integration (Honest empty state when unlinked)
        DashboardSummaryDto.CardStatus githubCard = DashboardSummaryDto.CardStatus.builder()
                .key("github")
                .title("GitHub Integration")
                .state("NOT_CONNECTED")
                .stateLabel("Not Connected")
                .primaryMetric("GitHub Not Connected")
                .subtitle("Link profile for repo & commit sync")
                .ctaLabel("Connect GitHub")
                .ctaLink("/dashboard/github")
                .isCompleted(false)
                .build();

        // 5. Applications
        DashboardSummaryDto.CardStatus appsCard;
        if (applications.isEmpty()) {
            appsCard = DashboardSummaryDto.CardStatus.builder()
                    .key("applications")
                    .title("Applications")
                    .state("EMPTY")
                    .stateLabel("No Applications")
                    .primaryMetric("0 Applications")
                    .subtitle("Track jobs, rounds & deadlines")
                    .ctaLabel("Add Application")
                    .ctaLink("/dashboard/applications")
                    .isCompleted(false)
                    .build();
        } else {
            int totalApps = applications.size();
            String appMetric = activeAppsCount + " " + (activeAppsCount == 1 ? "Active Application" : "Active Applications");
            String subtitle = offersCount > 0
                    ? (offersCount + " " + (offersCount == 1 ? "Offer Received 🎉" : "Offers Received 🎉"))
                    : (activeAppsCount + " in active pipeline");

            appsCard = DashboardSummaryDto.CardStatus.builder()
                    .key("applications")
                    .title("Applications")
                    .state("ACTIVE")
                    .stateLabel(totalApps + " Total")
                    .primaryMetric(appMetric)
                    .subtitle(subtitle)
                    .ctaLabel("Manage Pipeline")
                    .ctaLink("/dashboard/applications")
                    .isCompleted(true)
                    .build();
        }

        return DashboardSummaryDto.JourneyStatusDto.builder()
                .resume(resumeCard)
                .dsa(dsaCard)
                .mockInterview(interviewCard)
                .github(githubCard)
                .applications(appsCard)
                .build();
    }

    private List<DashboardSummaryDto.NextActionDto> buildNextActions(
            boolean hasResume, Integer atsScore, boolean hasInterview, boolean hasCompanyPrep,
            boolean hasApplications, boolean hasRoadmap, ResumeEntity latestResume,
            InterviewSessionEntity latestCompletedInterview) {

        List<DashboardSummaryDto.NextActionDto> actions = new ArrayList<>();

        if (!hasResume) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-resume")
                    .title("Upload your master resume")
                    .description("Upload your PDF/DOCX resume to unlock automated ATS analysis and tailored interview questions.")
                    .priority("HIGH")
                    .category("RESUME")
                    .ctaLabel("Upload Resume")
                    .ctaLink("/dashboard/resume")
                    .icon("FileText")
                    .build());
        } else if (atsScore != null && atsScore < 75) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-ats")
                    .title("Optimize resume ATS score (" + atsScore + "/100)")
                    .description("Incorporate missing technical skills and action verbs to increase recruiter screening pass rates.")
                    .priority("HIGH")
                    .category("ATS")
                    .ctaLabel("View Suggestions")
                    .ctaLink("/dashboard/ats")
                    .icon("Sparkles")
                    .build());
        }

        if (!hasInterview) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-interview")
                    .title("Take your first AI mock interview")
                    .description("Experience a real conversational technical interview with live feedback on communication and problem-solving.")
                    .priority("HIGH")
                    .category("INTERVIEW")
                    .ctaLabel("Start Mock Interview")
                    .ctaLink("/dashboard/interview")
                    .icon("Mic")
                    .build());
        } else if (latestCompletedInterview != null && latestCompletedInterview.getOverallScore() != null && latestCompletedInterview.getOverallScore() < 75) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-interview-retry")
                    .title("Practice another mock interview round")
                    .description("Improve on your last score (" + latestCompletedInterview.getOverallScore() + "/100) by practicing structured answers.")
                    .priority("MEDIUM")
                    .category("INTERVIEW")
                    .ctaLabel("Retake Interview")
                    .ctaLink("/dashboard/interview")
                    .icon("RotateCcw")
                    .build());
        }

        if (!hasCompanyPrep) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-company")
                    .title("Start a targeted company prep track")
                    .description("Review interview rounds, expected packages, and specific preparation topics for top tech firms.")
                    .priority("MEDIUM")
                    .category("COMPANY")
                    .ctaLabel("Explore Companies")
                    .ctaLink("/dashboard/companies")
                    .icon("Building2")
                    .build());
        }

        if (!hasApplications) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-apps")
                    .title("Track your job & internship applications")
                    .description("Keep track of deadlines, recruiters, OA dates, and interview stages in one place.")
                    .priority("MEDIUM")
                    .category("APPLICATIONS")
                    .ctaLabel("Add Application")
                    .ctaLink("/dashboard/applications")
                    .icon("Briefcase")
                    .build());
        }

        if (!hasRoadmap) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-roadmap")
                    .title("Generate your 60-day placement roadmap")
                    .description("Get a customized week-by-week study schedule tailored to your target company and dream role.")
                    .priority("LOW")
                    .category("ROADMAP")
                    .ctaLabel("Generate Roadmap")
                    .ctaLink("/dashboard/roadmap")
                    .icon("Compass")
                    .build());
        }

        // If everything is done, provide advanced maintenance action
        if (actions.isEmpty()) {
            actions.add(DashboardSummaryDto.NextActionDto.builder()
                    .id("act-advanced-interview")
                    .title("Take a Hard-difficulty mock interview")
                    .description("Challenge yourself with system architecture and advanced problem-solving questions.")
                    .priority("LOW")
                    .category("INTERVIEW")
                    .ctaLabel("Start Hard Interview")
                    .ctaLink("/dashboard/interview")
                    .icon("Trophy")
                    .build());
        }

        return actions;
    }

    private List<DashboardSummaryDto.RecentActivityDto> buildRecentActivity(
            List<ResumeEntity> resumes, List<InterviewSessionEntity> completedSessions,
            List<ApplicationEntity> applications, List<UserCompanyPreparationEntity> companyPreps,
            List<RoadmapEntity> roadmaps) {

        List<DashboardSummaryDto.RecentActivityDto> activities = new ArrayList<>();
        Set<String> seenIds = new HashSet<>();
        DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

        // 1. Resumes (deduplicated by ID)
        for (ResumeEntity r : resumes) {
            if (r != null && r.getId() != null && r.getUploadDate() != null) {
                String actId = "act-res-" + r.getId();
                if (seenIds.add(actId)) {
                    String fileName = r.getOriginalFileName() != null ? r.getOriginalFileName() : "Resume";
                    activities.add(DashboardSummaryDto.RecentActivityDto.builder()
                            .id(actId)
                            .title("Resume Uploaded")
                            .description(fileName + " uploaded for analysis")
                            .type("RESUME_UPLOAD")
                            .timestamp(r.getUploadDate().format(isoFormatter))
                            .relativeTime(formatRelativeTime(r.getUploadDate()))
                            .link("/dashboard/resume")
                            .build());
                }
            }
        }

        // 2. Completed Mock Interviews (strictly deduplicated by Session ID)
        for (InterviewSessionEntity s : completedSessions) {
            if (s == null || s.getId() == null) continue;
            String actId = "act-int-" + s.getId();
            if (seenIds.add(actId)) {
                LocalDateTime time = s.getEndedAt() != null ? s.getEndedAt() : s.getStartedAt();
                if (time != null) {
                    String compName = s.getCompanyName() != null ? s.getCompanyName() : "Interview Practice";
                    String diff = s.getDifficulty() != null ? s.getDifficulty() : "Practice";
                    String scoreTxt = s.getOverallScore() != null ? ("Scored " + s.getOverallScore() + "/100") : "Completed";
                    activities.add(DashboardSummaryDto.RecentActivityDto.builder()
                            .id(actId)
                            .title("Mock Interview Completed")
                            .description(compName + " (" + diff + ") · " + scoreTxt)
                            .type("INTERVIEW_COMPLETED")
                            .timestamp(time.format(isoFormatter))
                            .relativeTime(formatRelativeTime(time))
                            .link("/dashboard/interview")
                            .build());
                }
            }
        }

        // 3. Applications (deduplicated by Application ID)
        for (ApplicationEntity a : applications) {
            if (a == null || a.getId() == null) continue;
            String actId = "act-app-" + a.getId();
            if (seenIds.add(actId)) {
                LocalDateTime time = a.getUpdatedAt() != null ? a.getUpdatedAt() : a.getCreatedAt();
                if (time != null) {
                    String compName = a.getCompanyName() != null ? a.getCompanyName() : "Job Application";
                    String roleName = a.getRole() != null ? a.getRole() : "Candidate";
                    String statusName = a.getStatus() != null ? a.getStatus() : "Applied";
                    activities.add(DashboardSummaryDto.RecentActivityDto.builder()
                            .id(actId)
                            .title("Application: " + compName)
                            .description(roleName + " · Status: " + statusName)
                            .type("APPLICATION_ADDED")
                            .timestamp(time.format(isoFormatter))
                            .relativeTime(formatRelativeTime(time))
                            .link("/dashboard/applications")
                            .build());
                }
            }
        }

        // 4. Roadmaps (deduplicated by Roadmap ID)
        for (RoadmapEntity rm : roadmaps) {
            if (rm != null && rm.getId() != null && rm.getCreatedAt() != null) {
                String actId = "act-rm-" + rm.getId();
                if (seenIds.add(actId)) {
                    String comp = rm.getCompany() != null ? rm.getCompany() : "Career";
                    String role = rm.getRole() != null ? rm.getRole() : "Developer";
                    String duration = rm.getDuration() != null ? rm.getDuration() : "8 Weeks";
                    activities.add(DashboardSummaryDto.RecentActivityDto.builder()
                            .id(actId)
                            .title("Roadmap Generated")
                            .description(comp + " · " + role + " (" + duration + ")")
                            .type("ROADMAP_GENERATED")
                            .timestamp(rm.getCreatedAt().format(isoFormatter))
                            .relativeTime(formatRelativeTime(rm.getCreatedAt()))
                            .link("/dashboard/roadmap")
                            .build());
                }
            }
        }

        // Sort descending by timestamp
        activities.sort((a, b) -> {
            if (a.getTimestamp() == null && b.getTimestamp() == null) return 0;
            if (a.getTimestamp() == null) return 1;
            if (b.getTimestamp() == null) return -1;
            return b.getTimestamp().compareTo(a.getTimestamp());
        });

        // Limit to 6 items
        return activities.stream().limit(6).collect(Collectors.toList());
    }

    private DashboardSummaryDto.ProfileCompletionDto buildProfileCompletion(
            User user, boolean hasResume, boolean hasInterview, boolean hasCompanyPrep, boolean hasApplications) {

        List<DashboardSummaryDto.FieldStatus> fields = new ArrayList<>();
        fields.add(new DashboardSummaryDto.FieldStatus("Full Name", user != null && user.getFullName() != null && !user.getFullName().isBlank()));
        fields.add(new DashboardSummaryDto.FieldStatus("Verified Email", user != null && user.isEmailVerified()));
        fields.add(new DashboardSummaryDto.FieldStatus("Resume Uploaded", hasResume));
        fields.add(new DashboardSummaryDto.FieldStatus("Company Track Started", hasCompanyPrep));
        fields.add(new DashboardSummaryDto.FieldStatus("Mock Interview Completed", hasInterview));
        fields.add(new DashboardSummaryDto.FieldStatus("Job Application Added", hasApplications));

        int completedCount = (int) fields.stream().filter(DashboardSummaryDto.FieldStatus::isCompleted).count();
        int totalCount = fields.size();
        int percentage = (int) Math.round(((double) completedCount / totalCount) * 100);

        return DashboardSummaryDto.ProfileCompletionDto.builder()
                .percentage(percentage)
                .completedFieldsCount(completedCount)
                .totalFieldsCount(totalCount)
                .fields(fields)
                .build();
    }

    private String formatRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) return "Recently";
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        if (minutes < 2) return "Just now";
        if (minutes < 60) return minutes + " " + (minutes == 1 ? "min ago" : "mins ago");
        long hours = ChronoUnit.HOURS.between(dateTime, now);
        if (hours < 24) return hours + " " + (hours == 1 ? "hour ago" : "hours ago");
        long days = ChronoUnit.DAYS.between(dateTime, now);
        if (days == 1) return "Yesterday";
        if (days < 30) return days + " " + (days == 1 ? "day ago" : "days ago");
        return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
    }
}
