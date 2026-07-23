package com.careeros.ats;

/**
 * DTO representing a matched keyword between the resume and job criteria.
 * Placeholder implementation — no actual matching logic.
 */
public class KeywordMatch {

    private String keyword;
    private boolean found;
    private String section;
    private int frequency;

    public KeywordMatch() {}

    public KeywordMatch(String keyword, boolean found, String section, int frequency) {
        this.keyword = keyword;
        this.found = found;
        this.section = section;
        this.frequency = frequency;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public boolean isFound() {
        return found;
    }

    public void setFound(boolean found) {
        this.found = found;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }
}

