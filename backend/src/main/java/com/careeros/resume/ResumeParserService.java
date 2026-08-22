package com.careeros.resume;

import com.careeros.resume.extraction.ExtractedResumeContent;
import com.careeros.resume.extraction.MultiStageResumeExtractor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Service responsible for parsing resume files (PDF and DOCX).
 * Integrates MultiStageResumeExtractor for robust PDFBox + OCR + POI fallback pipeline.
 */
@Service
public class ResumeParserService {

    private static final Logger log = LoggerFactory.getLogger(ResumeParserService.class);

    private final MultiStageResumeExtractor multiStageResumeExtractor;

    public ResumeParserService(MultiStageResumeExtractor multiStageResumeExtractor) {
        this.multiStageResumeExtractor = multiStageResumeExtractor;
    }

    /**
     * Extract rich resume content using the multi-stage extraction pipeline.
     */
    public ExtractedResumeContent extractContent(byte[] fileBytes, String fileType) {
        return multiStageResumeExtractor.extract(fileBytes, fileType);
    }

    /**
     * Parse a PDF file and return its full text content.
     */
    public String parsePdf(InputStream inputStream) throws IOException {
        byte[] bytes = inputStream.readAllBytes();
        ExtractedResumeContent content = multiStageResumeExtractor.extract(bytes, "pdf");
        return content.getCleanText();
    }

    /**
     * Parse a DOCX file and return its full text content.
     */
    public String parseDocx(InputStream inputStream) throws IOException {
        byte[] bytes = inputStream.readAllBytes();
        ExtractedResumeContent content = multiStageResumeExtractor.extract(bytes, "docx");
        return content.getCleanText();
    }

    /**
     * Extract plain text from a resume file based on its type.
     */
    public String extractText(InputStream inputStream, String fileType) throws IOException {
        byte[] bytes = inputStream.readAllBytes();
        ExtractedResumeContent content = multiStageResumeExtractor.extract(bytes, fileType);
        return content.getCleanText();
    }

    /**
     * Extract basic metadata from a PDF file.
     */
    public Map<String, String> extractBasicMetadata(InputStream inputStream, String fileType)
            throws IOException {
        Map<String, String> metadata = new HashMap<>();

        if ("pdf".equalsIgnoreCase(fileType)) {
            try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
                PDDocumentInformation info = document.getDocumentInformation();
                putIfNotNull(metadata, "title", info.getTitle());
                putIfNotNull(metadata, "author", info.getAuthor());
                putIfNotNull(metadata, "subject", info.getSubject());
                putIfNotNull(metadata, "keywords", info.getKeywords());
                metadata.put("pageCount", String.valueOf(document.getNumberOfPages()));
            }
        } else if ("docx".equalsIgnoreCase(fileType)) {
            metadata.put("format", "DOCX");
            metadata.put("parser", "Apache POI");
        }

        metadata.put("fileType", fileType);
        return metadata;
    }

    private void putIfNotNull(Map<String, String> map, String key, String value) {
        if (value != null && !value.isBlank()) {
            map.put(key, value);
        }
    }
}
