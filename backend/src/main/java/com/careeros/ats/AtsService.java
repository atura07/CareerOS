package com.careeros.ats;

import com.careeros.resume.ResumeParserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

/**
 * Service layer for the ATS Engine.
 * <p>
 * Integrates with ResumeParserService to obtain extracted text,
 * then delegates to AtsAnalyzer for the full analysis pipeline.
 * <p>
 * Currently returns placeholder data. Ready for future expansion with
 * job description comparison, custom keyword sets, and batch processing.
 */
@Service
public class AtsService {

    private static final Logger log = LoggerFactory.getLogger(AtsService.class);

    private final ResumeParserService resumeParserService;
    private final AtsAnalyzer atsAnalyzer;

    public AtsService(ResumeParserService resumeParserService,
                      AtsAnalyzer atsAnalyzer) {
        this.resumeParserService = resumeParserService;
        this.atsAnalyzer = atsAnalyzer;
    }

    /**
     * Analyze a resume by parsing the file and running the full ATS pipeline.
     * <p>
     * Accepts raw file bytes and file type, uses ResumeParserService to
     * extract text, then runs the ATS analyzer.
     *
     * @param fileBytes the raw bytes of the uploaded file
     * @param fileType  "pdf" or "docx"
     * @return AtsResponse with score, keywords, sections, and suggestions
     */
    public AtsResponse analyzeResume(byte[] fileBytes, String fileType) {
        log.info("analyzeResume called — fileType={}, size={}", fileType, fileBytes.length);

        // 1. Extract text using ResumeParserService
        String extractedText;
        try {
            InputStream inputStream = new ByteArrayInputStream(fileBytes);
            extractedText = resumeParserService.extractText(inputStream, fileType);
        } catch (Exception e) {
            log.error("Failed to parse resume for ATS analysis", e);
            extractedText = "[Parsing failed — analysis cannot be completed]";
        }

        // 2. Run ATS analysis pipeline
        return analyzeText(extractedText);
    }

    /**
     * Analyze a resume from its already-extracted text.
     * <p>
     * Useful when the text has already been extracted and stored
     * (e.g., from the ResumeService upload flow).
     *
     * @param extractedText the plain text extracted from the resume
     * @return AtsResponse with score, keywords, sections, and suggestions
     */
    public AtsResponse analyzeText(String extractedText) {
        log.info("analyzeText called — textLength={}",
                extractedText != null ? extractedText.length() : 0);

        if (extractedText == null || extractedText.isBlank()) {
            log.warn("Empty extracted text provided for ATS analysis");
            return new AtsResponse(
                    0,
                    java.util.List.of(),
                    java.util.List.of(),
                    java.util.List.of(new AtsSuggestion(
                            "Upload a valid resume file to receive ATS analysis",
                            "error"
                    ))
            );
        }

        return atsAnalyzer.analyze(extractedText);
    }
}

