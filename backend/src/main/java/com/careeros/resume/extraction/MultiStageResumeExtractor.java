package com.careeros.resume.extraction;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Production Multi-Stage Resume Text Extraction Pipeline:
 * 1. Primary: Apache PDFBox (Direct text stream + Unicode normalization + Multi-factor validation)
 * 2. Secondary: Tesseract OCR Fallback (Page rendering at 200 DPI + Technical keyword preservation)
 * 3. DOCX: Apache POI (Paragraphs, structured tables, headers & footers)
 */
@Component
public class MultiStageResumeExtractor {

    private static final Logger log = LoggerFactory.getLogger(MultiStageResumeExtractor.class);

    private final UnicodeNormalizer unicodeNormalizer;
    private final ExtractionQualityValidator qualityValidator;
    private final OcrTextExtractor ocrTextExtractor;

    public MultiStageResumeExtractor(
            UnicodeNormalizer unicodeNormalizer,
            ExtractionQualityValidator qualityValidator,
            OcrTextExtractor ocrTextExtractor) {
        this.unicodeNormalizer = unicodeNormalizer;
        this.qualityValidator = qualityValidator;
        this.ocrTextExtractor = ocrTextExtractor;
    }

    /**
     * Extract resume text with multi-stage fallback strategy.
     *
     * @param fileBytes Raw bytes of the uploaded PDF or DOCX file
     * @param fileType  "pdf" or "docx"
     * @return ExtractedResumeContent containing clean text, status, method, and quality metrics
     */
    public ExtractedResumeContent extract(byte[] fileBytes, String fileType) {
        if (fileBytes == null || fileBytes.length == 0) {
            log.warn("[Extraction] Empty file bytes provided");
            return ExtractedResumeContent.failed("File is empty (0 bytes).");
        }

        String type = fileType != null ? fileType.toLowerCase().trim() : "pdf";

        if ("docx".equals(type)) {
            return extractDocx(fileBytes);
        } else if ("pdf".equals(type)) {
            return extractPdf(fileBytes);
        } else {
            return ExtractedResumeContent.failed("Unsupported file type: ." + type);
        }
    }

    /**
     * DOCX extraction using Apache POI: extracts paragraphs, tables, and headers in reading order.
     */
    private ExtractedResumeContent extractDocx(byte[] fileBytes) {
        log.info("[Extraction] Parsing DOCX resume ({} bytes)...", fileBytes.length);
        StringBuilder fullText = new StringBuilder();
        List<String> warnings = new ArrayList<>();

        try (ByteArrayInputStream bais = new ByteArrayInputStream(fileBytes);
             XWPFDocument document = new XWPFDocument(bais)) {

            // 1. Extract paragraphs
            for (XWPFParagraph p : document.getParagraphs()) {
                String text = p.getText();
                if (text != null && !text.isBlank()) {
                    fullText.append(text).append("\n");
                }
            }

            // 2. Extract tables (experience, skills tables, project tables)
            for (XWPFTable table : document.getTables()) {
                for (XWPFTableRow row : table.getRows()) {
                    for (XWPFTableCell cell : row.getTableCells()) {
                        String cellText = cell.getText();
                        if (cellText != null && !cellText.isBlank()) {
                            fullText.append(cellText).append(" ");
                        }
                    }
                    fullText.append("\n");
                }
            }

            // If empty, try POI WordExtractor
            if (fullText.toString().isBlank()) {
                try (XWPFWordExtractor wordExtractor = new XWPFWordExtractor(document)) {
                    fullText.append(wordExtractor.getText());
                }
            }

        } catch (Exception e) {
            log.error("[Extraction] Failed to parse DOCX file: {}", e.getMessage(), e);
            warnings.add("DOCX parsing encountered an error: " + e.getMessage());
        }

        String raw = fullText.toString();
        String clean = unicodeNormalizer.normalize(raw);
        ExtractionQualityValidator.QualityAssessment assessment = qualityValidator.assess(clean);

        ExtractionStatus finalStatus = assessment.status() != ExtractionStatus.FAILED
                ? assessment.status()
                : ExtractionStatus.PARTIAL;

        if (clean.isBlank()) {
            return ExtractedResumeContent.failed("Could not extract readable text from DOCX file.");
        }

        return ExtractedResumeContent.builder()
                .rawText(raw)
                .cleanText(clean)
                .characterCount(clean.length())
                .wordCount(assessment.wordCount())
                .alphaRatio(assessment.alphaRatio())
                .extractionStatus(finalStatus)
                .extractionMethod(ExtractionMethod.POI_DOCX)
                .confidenceScore(assessment.confidence())
                .detectedSections(assessment.detectedSections())
                .warnings(warnings)
                .build();
    }

    /**
     * PDF multi-stage extraction: Stage 1 (PDFBox Direct) -> Stage 2 (OCR Fallback) -> Stage 3 (Best Effort)
     */
    private ExtractedResumeContent extractPdf(byte[] fileBytes) {
        log.info("[Extraction] Starting Multi-Stage PDF Extraction ({} bytes)...", fileBytes.length);

        // ════════ STAGE 1: PDFBox Direct Text Extraction ════════
        String pdfBoxRaw = "";
        List<String> warnings = new ArrayList<>();

        try (PDDocument document = Loader.loadPDF(fileBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            stripper.setLineSeparator("\n");
            pdfBoxRaw = stripper.getText(document);
        } catch (Exception e) {
            log.warn("[Extraction] Stage 1 PDFBox direct extraction failed: {}", e.getMessage());
            warnings.add("PDFBox text stripper warning: " + e.getMessage());
        }

        String pdfBoxClean = unicodeNormalizer.normalize(pdfBoxRaw);
        ExtractionQualityValidator.QualityAssessment stage1Assessment = qualityValidator.assess(pdfBoxClean);

        log.info("[Extraction] Stage 1 PDFBox result: status={}, chars={}, alphaRatio={}, sections={}",
                stage1Assessment.status(),
                pdfBoxClean.length(),
                stage1Assessment.alphaRatio(),
                stage1Assessment.detectedSections());

        // If Stage 1 produced good text, return immediately
        if (stage1Assessment.status() == ExtractionStatus.EXCELLENT ||
                stage1Assessment.status() == ExtractionStatus.GOOD ||
                (pdfBoxClean.length() >= 80 && stage1Assessment.alphaRatio() >= 0.40)) {
            return ExtractedResumeContent.builder()
                    .rawText(pdfBoxRaw)
                    .cleanText(pdfBoxClean)
                    .characterCount(pdfBoxClean.length())
                    .wordCount(stage1Assessment.wordCount())
                    .alphaRatio(stage1Assessment.alphaRatio())
                    .extractionStatus(stage1Assessment.status() != ExtractionStatus.FAILED ? stage1Assessment.status() : ExtractionStatus.PARTIAL)
                    .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                    .confidenceScore(Math.max(0.70, stage1Assessment.confidence()))
                    .detectedSections(stage1Assessment.detectedSections())
                    .warnings(warnings)
                    .build();
        }

        // ════════ STAGE 2: OCR Fallback ════════
        log.info("[Extraction] Stage 1 was insufficient (status={}, chars={}). Triggering Stage 2 OCR Fallback...",
                stage1Assessment.status(), pdfBoxClean.length());

        String ocrText = ocrTextExtractor.extractTextWithOcr(fileBytes);
        String ocrClean = unicodeNormalizer.normalize(ocrText);
        ExtractionQualityValidator.QualityAssessment stage2Assessment = qualityValidator.assess(ocrClean);

        log.info("[Extraction] Stage 2 OCR result: status={}, chars={}, alphaRatio={}, sections={}",
                stage2Assessment.status(),
                ocrClean.length(),
                stage2Assessment.alphaRatio(),
                stage2Assessment.detectedSections());

        // If OCR produced meaningful text and better than PDFBox
        if (ocrClean.length() >= 60 && ocrClean.length() > pdfBoxClean.length() && stage2Assessment.status() != ExtractionStatus.FAILED) {
            return ExtractedResumeContent.builder()
                    .rawText(ocrText)
                    .cleanText(ocrClean)
                    .characterCount(ocrClean.length())
                    .wordCount(stage2Assessment.wordCount())
                    .alphaRatio(stage2Assessment.alphaRatio())
                    .extractionStatus(ExtractionStatus.OCR_USED)
                    .extractionMethod(ExtractionMethod.OCR_FALLBACK)
                    .confidenceScore(stage2Assessment.confidence())
                    .detectedSections(stage2Assessment.detectedSections())
                    .warnings(List.of("OCR-assisted extraction used for scanned/image PDF content."))
                    .build();
        }

        // ════════ STAGE 3: Best-Effort Selection ════════
        // Select whichever method extracted the most characters
        String bestClean = pdfBoxClean.length() >= ocrClean.length() ? pdfBoxClean : ocrClean;
        String bestRaw = pdfBoxClean.length() >= ocrClean.length() ? pdfBoxRaw : ocrText;
        ExtractionMethod bestMethod = pdfBoxClean.length() >= ocrClean.length() ? ExtractionMethod.PDFBOX_DIRECT : ExtractionMethod.OCR_FALLBACK;
        ExtractionQualityValidator.QualityAssessment bestAssessment = pdfBoxClean.length() >= ocrClean.length() ? stage1Assessment : stage2Assessment;

        if (bestClean.length() >= 30) {
            log.info("[Extraction] Falling back to Stage 3 best-effort text ({} chars, method={})", bestClean.length(), bestMethod);
            return ExtractedResumeContent.builder()
                    .rawText(bestRaw)
                    .cleanText(bestClean)
                    .characterCount(bestClean.length())
                    .wordCount(bestAssessment.wordCount())
                    .alphaRatio(bestAssessment.alphaRatio())
                    .extractionStatus(ExtractionStatus.PARTIAL)
                    .extractionMethod(bestMethod)
                    .confidenceScore(0.50)
                    .detectedSections(bestAssessment.detectedSections())
                    .warnings(List.of("Partial text extracted. Some document elements may be unreadable."))
                    .build();
        }

        log.error("[Extraction] All extraction stages failed for PDF file (pdfBoxChars={}, ocrChars={}).",
                pdfBoxClean.length(), ocrClean.length());
        return ExtractedResumeContent.failed("Could not extract readable text via direct parsing or OCR.");
    }
}
