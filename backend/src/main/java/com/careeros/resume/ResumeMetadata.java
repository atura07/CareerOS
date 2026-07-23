package com.careeros.resume;

/**
 * DTO representing the metadata of an uploaded resume.
 * Used internally for file processing and storage.
 */
public class ResumeMetadata {

    private String originalFileName;
    private String storedFileName;
    private Long fileSize;
    private String fileType;

    public ResumeMetadata() {}

    public ResumeMetadata(String originalFileName, String storedFileName,
                          Long fileSize, String fileType) {
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getStoredFileName() {
        return storedFileName;
    }

    public void setStoredFileName(String storedFileName) {
        this.storedFileName = storedFileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
}

