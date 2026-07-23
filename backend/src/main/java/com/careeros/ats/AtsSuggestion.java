package com.careeros.ats;

/**
 * DTO representing a single actionable suggestion for improving the resume.
 * Placeholder implementation — no actual suggestion logic.
 */
public class AtsSuggestion {

    private String section;
    private String category;
    private String message;
    private String severity; // "high", "medium", "low"

    public AtsSuggestion() {}

    public AtsSuggestion(String message, String category) {
        this.message = message;
        this.category = category;
    }

    public AtsSuggestion(String section, String category, String message, String severity) {
        this.section = section;
        this.category = category;
        this.message = message;
        this.severity = severity;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }
}

