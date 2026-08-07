package com.careeros.roadmap;

import java.time.LocalDateTime;

/**
 * Outbound DTO for a roadmap.
 */
public class RoadmapResponse {

    private Long id;
    private Long userId;
    private String company;
    private String role;
    private String duration;
    private Integer totalWeeks;
    private String focusAreas;
    private String currentSkills;
    private String weeklyPlans;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoadmapResponse() {}

    public static RoadmapResponse fromEntity(RoadmapEntity entity) {
        RoadmapResponse r = new RoadmapResponse();
        r.id = entity.getId();
        r.userId = entity.getUserId();
        r.company = entity.getCompany();
        r.role = entity.getRole();
        r.duration = entity.getDuration();
        r.totalWeeks = entity.getTotalWeeks();
        r.focusAreas = entity.getFocusAreas();
        r.currentSkills = entity.getCurrentSkills();
        r.weeklyPlans = entity.getWeeklyPlans();
        r.createdAt = entity.getCreatedAt();
        r.updatedAt = entity.getUpdatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getTotalWeeks() {
        return totalWeeks;
    }

    public void setTotalWeeks(Integer totalWeeks) {
        this.totalWeeks = totalWeeks;
    }

    public String getFocusAreas() {
        return focusAreas;
    }

    public void setFocusAreas(String focusAreas) {
        this.focusAreas = focusAreas;
    }

    public String getCurrentSkills() {
        return currentSkills;
    }

    public void setCurrentSkills(String currentSkills) {
        this.currentSkills = currentSkills;
    }

    public String getWeeklyPlans() {
        return weeklyPlans;
    }

    public void setWeeklyPlans(String weeklyPlans) {
        this.weeklyPlans = weeklyPlans;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
