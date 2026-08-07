package com.careeros.ats;

/**
 * Request DTO for the JD-based ATS analysis endpoint.
 * <p>
 * Carries the resume identifier (as a Long matching the entity PK)
 * and the job description text that will be compared against the
 * resume's extracted content.
 */
public class ATSAnalysisRequest {

    private Long resumeId;
    private String jobDescription;

    public ATSAnalysisRequest() {}

    public ATSAnalysisRequest(Long resumeId, String jobDescription) {
        this.resumeId = resumeId;
        this.jobDescription = jobDescription;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
}

