package com.careeros.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {

    private GreetingDto greeting;
    private PlacementReadinessDto placementReadiness;
    private JourneyStatusDto journey;
    private List<NextActionDto> nextActions;
    private List<RecentActivityDto> recentActivity;
    private ProfileCompletionDto profileCompletion;
    private ConsistencyDto consistency;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GreetingDto {
        private String name;
        private String timeGreeting; // "Good morning", "Good afternoon", "Good evening"
        private String subtitle;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlacementReadinessDto {
        private boolean available;
        private Integer score; // 0-100 if available, null otherwise
        private String status; // "NOT_ENOUGH_DATA", "GETTING_STARTED", "BUILDING_MOMENTUM", "DEVELOPING", "INTERVIEW_READY"
        private String statusLabel; // User-friendly label
        private String message;
        private List<String> requiredMilestones; // Missing milestones to unlock score
        private Integer completedMilestonesCount;
        private Integer totalMilestonesCount;
        private String strongestArea;
        private String areaNeedingAttention;
        private String recommendedNextAction;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JourneyStatusDto {
        private CardStatus resume;
        private CardStatus dsa;
        private CardStatus mockInterview;
        private CardStatus github;
        private CardStatus applications;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CardStatus {
        private String key; // "resume", "dsa", "interview", "github", "applications"
        private String title;
        private String state; // e.g. "NOT_UPLOADED", "UPLOADED", "ANALYZED", "NOT_ATTEMPTED", "IN_PROGRESS", "COMPLETED", "CONNECTED", "NOT_CONNECTED"
        private String stateLabel; // e.g. "Uploaded & Analyzed", "Not Attempted"
        private String primaryMetric; // e.g. "ATS Score: 85", "3 Interviews Taken", "4 Active Applications"
        private String subtitle; // e.g. "Last updated 2 days ago"
        private String ctaLabel; // e.g. "Upload Resume", "Start Interview"
        private String ctaLink; // e.g. "/dashboard/resume", "/dashboard/interview"
        private boolean isCompleted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NextActionDto {
        private String id;
        private String title;
        private String description;
        private String priority; // "HIGH", "MEDIUM", "LOW"
        private String category; // "RESUME", "ATS", "INTERVIEW", "COMPANY", "APPLICATIONS", "ROADMAP"
        private String ctaLabel;
        private String ctaLink;
        private String icon; // Icon identifier for frontend rendering
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivityDto {
        private String id;
        private String title;
        private String description;
        private String type; // "RESUME_UPLOAD", "INTERVIEW_COMPLETED", "APPLICATION_ADDED", "PREP_TASK_COMPLETED", "ROADMAP_GENERATED"
        private String timestamp; // ISO 8601 string
        private String relativeTime; // e.g. "Just now", "2 hours ago", "Yesterday"
        private String link;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileCompletionDto {
        private int percentage; // 0-100
        private int completedFieldsCount;
        private int totalFieldsCount;
        private List<FieldStatus> fields;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FieldStatus {
        private String name;
        private boolean completed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConsistencyDto {
        private int activeDaysCount;
        private String message;
        private String quote;
        private String ctaLabel;
        private String ctaLink;
    }
}
