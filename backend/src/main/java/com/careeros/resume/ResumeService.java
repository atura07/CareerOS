package com.careeros.resume;

import com.careeros.resume.extraction.ExtractedResumeContent;
import com.careeros.resume.extraction.ExtractionStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

/**
 * Orchestrates the resume upload and extraction flow:
 * validation → storage → multi-stage parsing → persistence.
 */
@Service
@Transactional
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_TYPES = List.of("pdf", "docx");

    private final ResumeStorageService storageService;
    private final ResumeParserService parserService;
    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeStorageService storageService,
                         ResumeParserService parserService,
                         ResumeRepository resumeRepository) {
        this.storageService = storageService;
        this.parserService = parserService;
        this.resumeRepository = resumeRepository;
    }

    /**
     * Upload a resume file — validates, stores, runs multi-stage extraction, and persists.
     */
    public ResumeResponse uploadResume(MultipartFile file, Long userId) {
        // 1. Validate file
        validateFile(file);

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new ResumeUploadException("Failed to read uploaded file", e);
        }

        // 2. Store file to disk (for temporary caching/tools)
        ResumeMetadata metadata;
        try {
            metadata = storageService.storeFile(file);
        } catch (IOException e) {
            throw new ResumeUploadException("Failed to store uploaded file", e);
        }

        // 3. Multi-stage text extraction
        String extractedText;
        try {
            ExtractedResumeContent content = parserService.extractContent(fileBytes, metadata.getFileType());
            extractedText = content != null ? content.getCleanText() : "";
            log.info("Extraction completed for resume '{}': status={}, method={}, chars={}",
                    metadata.getOriginalFileName(),
                    content != null ? content.getExtractionStatus() : "NULL",
                    content != null ? content.getExtractionMethod() : "NULL",
                    content != null ? content.getCharacterCount() : 0);
        } catch (Exception e) {
            log.warn("Failed to parse resume text for file: {}", metadata.getOriginalFileName(), e);
            extractedText = "";
        }

        // 4. Check if resume with same file name already exists for this user
        List<ResumeEntity> existingResumes = resumeRepository.findByUserIdOrderByUploadDateDesc(userId);
        ResumeEntity entity = null;
        for (ResumeEntity r : existingResumes) {
            if (r.getOriginalFileName().equalsIgnoreCase(metadata.getOriginalFileName())) {
                entity = r;
                break;
            }
        }

        if (entity != null) {
            if (!entity.getStoredFileName().equals(metadata.getStoredFileName())) {
                try {
                    storageService.deleteFile(entity.getStoredFileName());
                } catch (IOException ignored) {}
            }
            entity.setStoredFileName(metadata.getStoredFileName());
            entity.setFileSize(metadata.getFileSize());
            entity.setFileType(metadata.getFileType());
            entity.setFileData(fileBytes);
            entity.setExtractedText(extractedText);
            entity.setUploadDate(java.time.LocalDateTime.now());
        } else {
            entity = new ResumeEntity(
                    userId,
                    metadata.getOriginalFileName(),
                    metadata.getStoredFileName(),
                    metadata.getFileSize(),
                    metadata.getFileType()
            );
            entity.setFileData(fileBytes);
            entity.setExtractedText(extractedText);
        }

        ResumeEntity saved = resumeRepository.save(entity);
        log.info("Resume saved successfully: id={}, userId={}, file={}, durableBytes={}",
                saved.getId(), userId, saved.getOriginalFileName(), fileBytes.length);

        return ResumeResponse.fromEntity(saved);
    }

    /**
     * Heals or re-extracts text for a resume if previously empty, null, or failed.
     */
    public ResumeEntity healExtractedTextIfNecessary(ResumeEntity resume) {
        if (resume == null) return null;

        String text = resume.getExtractedText();
        boolean needsExtraction = text == null || text.isBlank() || text.startsWith("[Parsing failed") || text.startsWith("Could not extract");

        if (!needsExtraction) {
            return resume;
        }

        log.info("[HEAL] Heal/re-extract triggered for resumeId={}", resume.getId());
        byte[] bytes = resume.getFileData();

        // If fileData is null, attempt to read from disk and backfill fileData
        if (bytes == null || bytes.length == 0) {
            try {
                Path filePath = storageService.getFilePath(resume.getStoredFileName());
                if (Files.exists(filePath)) {
                    bytes = Files.readAllBytes(filePath);
                    resume.setFileData(bytes);
                    log.info("[HEAL] Backfilled missing fileData from disk for resumeId={}", resume.getId());
                }
            } catch (Exception e) {
                log.warn("[HEAL] Could not read disk file for resumeId={}: {}", resume.getId(), e.getMessage());
            }
        }

        if (bytes != null && bytes.length > 0) {
            try {
                ExtractedResumeContent content = parserService.extractContent(bytes, resume.getFileType());
                if (content != null && !content.getCleanText().isBlank()) {
                    resume.setExtractedText(content.getCleanText());
                    ResumeEntity updated = resumeRepository.save(resume);
                    log.info("[HEAL SUCCESS] Successfully healed text for resumeId={}: new length={}, status={}, method={}",
                            resume.getId(), content.getCleanText().length(), content.getExtractionStatus(), content.getExtractionMethod());
                    return updated;
                }
            } catch (Exception e) {
                log.error("[HEAL ERROR] Failed to re-extract text for resumeId={}: {}", resume.getId(), e.getMessage());
            }
        } else {
            log.warn("[HEAL WARNING] Neither durable database fileData nor local disk file found for resumeId={}", resume.getId());
        }

        return resume;
    }

    /**
     * Get all resumes for a user.
     */
    @Transactional(readOnly = true)
    public List<ResumeResponse> getUserResumes(Long userId) {
        List<ResumeEntity> list = resumeRepository.findByUserIdOrderByUploadDateDesc(userId);
        java.util.Map<Long, ResumeEntity> uniqueById = new java.util.LinkedHashMap<>();
        for (ResumeEntity r : list) {
            uniqueById.putIfAbsent(r.getId(), r);
        }
        return uniqueById.values()
                .stream()
                .map(ResumeResponse::fromEntity)
                .toList();
    }

    /**
     * Get a single resume by ID and user ID.
     */
    @Transactional(readOnly = true)
    public ResumeResponse getResume(Long id, Long userId) {
        ResumeEntity entity = resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + id));

        if (!entity.getUserId().equals(userId)) {
            throw new ResumeNotFoundException("Resume not found with id: " + id);
        }

        return ResumeResponse.fromEntity(entity);
    }

    /**
     * Delete a resume by ID — removes file and database record.
     */
    public void deleteResume(Long id, Long userId) {
        ResumeEntity entity = resumeRepository.findById(id)
                .orElseThrow(() -> new ResumeNotFoundException("Resume not found with id: " + id));

        if (!entity.getUserId().equals(userId)) {
            throw new ResumeNotFoundException("Resume not found with id: " + id);
        }

        // Delete stored file
        try {
            storageService.deleteFile(entity.getStoredFileName());
        } catch (IOException e) {
            log.warn("Failed to delete stored file: {}", entity.getStoredFileName(), e);
        }

        resumeRepository.delete(entity);
        log.info("Resume deleted: id={}", id);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResumeUploadException("Uploaded file is empty or missing");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new ResumeUploadException("Uploaded file must have a valid name");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResumeUploadException(
                    "File size exceeds maximum allowed size of 5 MB. Uploaded: "
                            + (file.getSize() / (1024 * 1024)) + " MB");
        }

        // Validate file type
        String fileType = getFileType(originalFileName);
        if (!ALLOWED_TYPES.contains(fileType)) {
            throw new ResumeUploadException(
                    "Only PDF and DOCX files are accepted. Received: ." + fileType);
        }
    }

    private String getFileType(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            return fileName.substring(dotIndex + 1).toLowerCase();
        }
        return "";
    }
}
