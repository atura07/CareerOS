package com.careeros.application;

import java.time.LocalDateTime;

/**
 * Outbound DTO for a job application.
 */
public class ApplicationResponse {

    private Long id;
    private Long userId;
    private String companyName;
    private String companyLogo;
    private String role;
    private String packageValue;
    private String location;
    private String appliedDate;
    private String lastUpdated;
    private String status;
    private String nextRound;
    private String notes;
    private String recruiter;
    private String recruiterEmail;
    private String applicationLink;
    private String deadline;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {}

    public static ApplicationResponse fromEntity(ApplicationEntity entity) {
        ApplicationResponse r = new ApplicationResponse();
        r.id = entity.getId();
        r.userId = entity.getUserId();
        r.companyName = entity.getCompanyName();
        r.companyLogo = entity.getCompanyLogo();
        r.role = entity.getRole();
        r.packageValue = entity.getPackageValue();
        r.location = entity.getLocation();
        r.appliedDate = entity.getAppliedDate();
        r.lastUpdated = entity.getLastUpdated();
        r.status = entity.getStatus();
        r.nextRound = entity.getNextRound();
        r.notes = entity.getNotes();
        r.recruiter = entity.getRecruiter();
        r.recruiterEmail = entity.getRecruiterEmail();
        r.applicationLink = entity.getApplicationLink();
        r.deadline = entity.getDeadline();
        r.priority = entity.getPriority();
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyLogo() {
        return companyLogo;
    }

    public void setCompanyLogo(String companyLogo) {
        this.companyLogo = companyLogo;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPackageValue() {
        return packageValue;
    }

    public void setPackageValue(String packageValue) {
        this.packageValue = packageValue;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(String appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNextRound() {
        return nextRound;
    }

    public void setNextRound(String nextRound) {
        this.nextRound = nextRound;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getRecruiter() {
        return recruiter;
    }

    public void setRecruiter(String recruiter) {
        this.recruiter = recruiter;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public String getApplicationLink() {
        return applicationLink;
    }

    public void setApplicationLink(String applicationLink) {
        this.applicationLink = applicationLink;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
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
