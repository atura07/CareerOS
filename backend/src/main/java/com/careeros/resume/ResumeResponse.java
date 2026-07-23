package com.careeros.resume;

import java.time.LocalDateTime;

/**
 * DTO returned to the client after resume upload/processing.
 */
public class ResumeResponse {

    private Long id;
    private Long userId;
    private String originalFileName;
    private Long fileSize;
    private String fileType;
    private LocalDateTime uploadDate;
    private String extractedText;

    public ResumeResponse() {}

    public ResumeResponse(Long id, Long userId, String originalFileName,
                          Long fileSize, String fileType, LocalDateTime uploadDate,
                          String extractedText) {
        this.id = id;
        this.userId = userId;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.uploadDate = uploadDate;
        this.extractedText = extractedText;
    }

    public static ResumeResponse fromEntity(ResumeEntity entity) {
        return new ResumeResponse(
                entity.getId(),
                entity.getUserId(),
                entity.getOriginalFileName(),
                entity.getFileSize(),
                entity.getFileType(),
                entity.getUploadDate(),
                entity.getExtractedText()
        );
    }

    // Getters and Setters

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

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
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

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }
}

