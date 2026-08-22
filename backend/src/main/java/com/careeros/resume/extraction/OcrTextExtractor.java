package com.careeros.resume.extraction;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Production-grade OCR Text Extractor.
 * Renders PDF pages to high-resolution images and executes Tesseract OCR.
 */
@Component
public class OcrTextExtractor {

    private static final Logger log = LoggerFactory.getLogger(OcrTextExtractor.class);
    private static final int DPI = 200; // Optimal balance of recognition accuracy and memory/processing speed
    private static final int MAX_PAGES_OCR = 10; // Cap to prevent DOS on huge documents

    private final UnicodeNormalizer unicodeNormalizer;

    public OcrTextExtractor(UnicodeNormalizer unicodeNormalizer) {
        this.unicodeNormalizer = unicodeNormalizer;
    }

    public boolean isTesseractAvailable() {
        try {
            Process process = new ProcessBuilder("tesseract", "--version")
                    .redirectErrorStream(true)
                    .start();
            boolean finished = process.waitFor(3, TimeUnit.SECONDS);
            return finished && process.exitValue() == 0;
        } catch (Exception e) {
            log.debug("Tesseract CLI not available on system: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract text from PDF document byte array via OCR rendering.
     */
    public String extractTextWithOcr(byte[] pdfBytes) {
        if (pdfBytes == null || pdfBytes.length == 0) {
            return "";
        }

        if (!isTesseractAvailable()) {
            log.warn("[OCR] Tesseract binary is not installed or available on this system. Cannot perform image OCR.");
            return "";
        }

        log.info("[OCR] Starting Tesseract OCR extraction on PDF ({} bytes)", pdfBytes.length);
        List<Path> tempFiles = new ArrayList<>();
        StringBuilder fullOcrText = new StringBuilder();

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFRenderer renderer = new PDFRenderer(document);
            int totalPages = Math.min(document.getNumberOfPages(), MAX_PAGES_OCR);

            for (int pageIndex = 0; pageIndex < totalPages; pageIndex++) {
                log.debug("[OCR] Rendering page {}/{} at {} DPI", pageIndex + 1, totalPages, DPI);
                BufferedImage image = renderer.renderImageWithDPI(pageIndex, DPI, ImageType.RGB);

                Path tempImg = Files.createTempFile("ocr_page_" + pageIndex + "_", ".png");
                tempFiles.add(tempImg);
                ImageIO.write(image, "PNG", tempImg.toFile());

                Path tempOutBase = Files.createTempFile("ocr_out_" + pageIndex + "_", "");
                tempFiles.add(tempOutBase);
                Path tempTxtOut = Path.of(tempOutBase.toString() + ".txt");
                tempFiles.add(tempTxtOut);

                // Run tesseract: tesseract <image> <outbase> -l eng --psm 6
                ProcessBuilder pb = new ProcessBuilder(
                        "tesseract",
                        tempImg.toAbsolutePath().toString(),
                        tempOutBase.toAbsolutePath().toString(),
                        "-l", "eng",
                        "--oem", "1",
                        "--psm", "6"
                );
                pb.redirectErrorStream(true);
                Process process = pb.start();

                boolean finished = process.waitFor(20, TimeUnit.SECONDS);
                if (finished && process.exitValue() == 0 && Files.exists(tempTxtOut)) {
                    String pageText = Files.readString(tempTxtOut, StandardCharsets.UTF_8);
                    fullOcrText.append(pageText).append("\n\n");
                    log.debug("[OCR] Page {} extracted ({} chars)", pageIndex + 1, pageText.length());
                } else {
                    log.warn("[OCR] Tesseract failed on page {} with exit code {}",
                            pageIndex + 1, finished ? process.exitValue() : "TIMEOUT");
                }
            }
        } catch (Exception e) {
            log.error("[OCR] Error during PDF page rendering or OCR: {}", e.getMessage(), e);
        } finally {
            for (Path p : tempFiles) {
                try {
                    Files.deleteIfExists(p);
                } catch (Exception ignored) {}
            }
        }

        String cleaned = unicodeNormalizer.normalize(fullOcrText.toString());
        log.info("[OCR] Completed OCR extraction — total clean text length: {}", cleaned.length());
        return cleaned;
    }
}
