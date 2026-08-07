package com.careeros.roadmap;

/**
 * Inbound DTO for creating/updating a roadmap.
 * Lists are sent as JSON strings to keep the DTO simple.
 */
public class RoadmapRequest {

    private String company;
    private String role;
    private String duration;
    private Integer totalWeeks;
    private String focusAreas;
    private String currentSkills;
    private String weeklyPlans;

    public RoadmapRequest() {}

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
}
