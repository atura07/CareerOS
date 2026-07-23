package com.careeros.resume;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.List;

/**
 * Orchestrates the resume upload flow:
 * validation → storage → parsing → persistence.
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
     * Upload a resume file — validates, stores, parses, and persists metadata.
     *
     * @param file   the uploaded multipart file
     * @param userId the ID of the authenticated user
     * @return ResumeResponse with metadata and extracted text
     */
    public ResumeResponse uploadResume(MultipartFile file, Long userId) {
        // 1. Validate file
        validateFile(file);

        // 2. Store file to disk
        ResumeMetadata metadata;
        try {
            metadata = storageService.storeFile(file);
        } catch (IOException e) {
            throw new ResumeUploadException("Failed to store uploaded file", e);
        }

        // 3. Parse file and extract text
        String extractedText;
        try (InputStream inputStream = Files.newInputStream(
                storageService.getFilePath(metadata.getStoredFileName()))) {
            extractedText = parserService.extractText(inputStream, metadata.getFileType());
        } catch (IOException e) {
            log.warn("Failed to parse resume text for file: {}", metadata.getOriginalFileName(), e);
            extractedText = "[Parsing failed — file may be corrupted or unreadable]";
        }

        // 4. Save entity to database
        ResumeEntity entity = new ResumeEntity(
                userId,
                metadata.getOriginalFileName(),
                metadata.getStoredFileName(),
                metadata.getFileSize(),
                metadata.getFileType()
        );
        entity.setExtractedText(extractedText);

        ResumeEntity saved = resumeRepository.save(entity);
        log.info("Resume uploaded successfully: id={}, userId={}, file={}",
                saved.getId(), userId, saved.getOriginalFileName());

        return ResumeResponse.fromEntity(saved);
    }

    /**
     * Get all resumes for a user.
     */
    @Transactional(readOnly = true)
    public List<ResumeResponse> getUserResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadDateDesc(userId)
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

