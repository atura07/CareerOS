package com.careeros.resume;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Service responsible for parsing resume files (PDF and DOCX).
 * Extracts plain text and basic metadata.
 *
 * Architecture is modular and ready for future ATS keyword extraction.
 */
@Service
public class ResumeParserService {

    private static final Logger log = LoggerFactory.getLogger(ResumeParserService.class);

    /**
     * Parse a PDF file and return its full text content.
     *
     * @param inputStream InputStream of the PDF file
     * @return extracted plain text
     * @throws IOException if reading or parsing fails
     */
    public String parsePdf(InputStream inputStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        }
    }

    /**
     * Parse a DOCX file and return its full text content.
     *
     * @param inputStream InputStream of the DOCX file
     * @return extracted plain text
     * @throws IOException if reading or parsing fails
     */
    public String parseDocx(InputStream inputStream) throws IOException {
        try (XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    /**
     * Extract plain text from a resume file based on its type.
     *
     * @param inputStream InputStream of the file
     * @param fileType    "pdf" or "docx"
     * @return extracted plain text
     * @throws IOException if parsing fails
     * @throws IllegalArgumentException if fileType is unsupported
     */
    public String extractText(InputStream inputStream, String fileType) throws IOException {
        return switch (fileType.toLowerCase()) {
            case "pdf" -> parsePdf(inputStream);
            case "docx" -> parseDocx(inputStream);
            default -> throw new IllegalArgumentException(
                    "Unsupported file type: " + fileType + ". Only PDF and DOCX are supported.");
        };
    }

    /**
     * Extract basic metadata from a PDF file.
     * For DOCX, returns a placeholder structure.
     * This can be expanded in the future.
     *
     * @param inputStream InputStream of the file
     * @param fileType    "pdf" or "docx"
     * @return map of metadata key-value pairs
     * @throws IOException if reading fails
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
            // DOCX metadata placeholder — can be expanded
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

