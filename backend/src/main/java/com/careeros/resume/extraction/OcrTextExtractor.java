package com.careeros.resume.extraction;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
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
 * Renders PDF pages to high-resolution images and executes Tesseract OCR via stdout pipe streaming.
 */
@Component
public class OcrTextExtractor {

    private static final Logger log = LoggerFactory.getLogger(OcrTextExtractor.class);
    private static final int DPI = 120; // Lightweight 120 DPI for low-memory cloud container compatibility
    private static final int MAX_PAGES_OCR = 3; // Maximum pages to OCR on free cloud tiers

    private final UnicodeNormalizer unicodeNormalizer;

    public OcrTextExtractor(UnicodeNormalizer unicodeNormalizer) {
        this.unicodeNormalizer = unicodeNormalizer;
    }

    public boolean isTesseractAvailable() {
        try {
            Process process = new ProcessBuilder("tesseract", "--version")
                    .redirectErrorStream(true)
                    .start();
            byte[] output = process.getInputStream().readAllBytes();
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
                BufferedImage image = null;
                try {
                    image = renderer.renderImageWithDPI(pageIndex, DPI, ImageType.RGB);
                } catch (Exception renderEx) {
                    log.warn("[OCR] PDFRenderer failed for page {}: {}. Attempting direct XObject extraction...", pageIndex + 1, renderEx.getMessage());
                }

                // If renderer failed, fallback to embedded image XObject
                if (image == null && pageIndex < document.getNumberOfPages()) {
                    PDPage page = document.getPage(pageIndex);
                    PDResources resources = page.getResources();
                    if (resources != null) {
                        for (COSName name : resources.getXObjectNames()) {
                            if (resources.isImageXObject(name)) {
                                PDImageXObject imgObj = (PDImageXObject) resources.getXObject(name);
                                image = imgObj.getImage();
                                break;
                            }
                        }
                    }
                }

                if (image == null) {
                    log.warn("[OCR] Could not obtain image for page {}", pageIndex + 1);
                    continue;
                }

                Path tempImg = Files.createTempFile("ocr_page_" + pageIndex + "_", ".png");
                tempFiles.add(tempImg);
                ImageIO.write(image, "PNG", tempImg.toFile());

                // Run tesseract: tesseract <image> stdout -l eng
                ProcessBuilder pb = new ProcessBuilder(
                        "tesseract",
                        tempImg.toAbsolutePath().toString(),
                        "stdout",
                        "-l", "eng"
                );
                pb.environment().put("OMP_THREAD_LIMIT", "1");
                pb.environment().put("OMP_NUM_THREADS", "1");
                pb.redirectErrorStream(false);
                Process process = pb.start();

                // Read stdout directly in standard UTF-8 to prevent pipe buffer stalls
                String pageText = "";
                try (InputStream is = process.getInputStream()) {
                    pageText = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                } catch (Exception streamEx) {
                    log.warn("[OCR] Error reading Tesseract output stream: {}", streamEx.getMessage());
                }
                boolean finished = process.waitFor(15, TimeUnit.SECONDS);

                if (finished && process.exitValue() == 0 && !pageText.isBlank()) {
                    fullOcrText.append(pageText).append("\n\n");
                    log.info("[OCR] Page {} extracted successfully ({} chars)", pageIndex + 1, pageText.length());
                } else {
                    log.warn("[OCR] Tesseract returned exit code {} for page {} (text length: {})",
                            finished ? process.exitValue() : "TIMEOUT", pageIndex + 1, pageText.length());
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
