package com.careeros.resume;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service responsible for storing uploaded resume files to the local filesystem.
 * Files are stored under the configured upload directory with unique filenames.
 */
@Service
public class ResumeStorageService {

    private static final Logger log = LoggerFactory.getLogger(ResumeStorageService.class);

    @Value("${application.resume.upload-dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
            log.info("Resume upload directory initialized: {}", uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadPath, e);
        }
    }

    /**
     * Store a multipart file to the local filesystem.
     *
     * @param file     the uploaded multipart file
     * @return ResumeMetadata containing stored file info
     * @throws IOException if file storage fails
     */
    public ResumeMetadata storeFile(MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new IllegalArgumentException("Uploaded file must have a valid name");
        }

        // Generate a unique stored filename to prevent collisions
        String extension = getFileExtension(originalFileName);
        String storedFileName = UUID.randomUUID().toString() + extension;

        // Copy file to the target location
        Path targetLocation = uploadPath.resolve(storedFileName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        }

        log.info("Stored resume file: {} as {}", originalFileName, storedFileName);

        return new ResumeMetadata(
                originalFileName,
                storedFileName,
                file.getSize(),
                getFileType(originalFileName)
        );
    }

    /**
     * Delete a stored file from the filesystem.
     *
     * @param storedFileName the unique stored filename
     * @throws IOException if deletion fails
     */
    public void deleteFile(String storedFileName) throws IOException {
        Path filePath = uploadPath.resolve(storedFileName);
        Files.deleteIfExists(filePath);
        log.info("Deleted resume file: {}", storedFileName);
    }

    /**
     * Resolve the full path of a stored file.
     *
     * @param storedFileName the unique stored filename
     * @return full Path to the file
     */
    public Path getFilePath(String storedFileName) {
        return uploadPath.resolve(storedFileName);
    }

    /**
     * Get the upload directory path.
     */
    public Path getUploadPath() {
        return uploadPath;
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            return fileName.substring(dotIndex);
        }
        return "";
    }

    private String getFileType(String fileName) {
        String ext = getFileExtension(fileName).toLowerCase();
        return switch (ext) {
            case ".pdf" -> "pdf";
            case ".docx" -> "docx";
            default -> ext.replace(".", "");
        };
    }
}

