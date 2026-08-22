package com.careeros.resume;

import com.careeros.resume.extraction.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MultiStageResumeExtractorTest {

    private UnicodeNormalizer unicodeNormalizer;
    private ExtractionQualityValidator qualityValidator;
    @Mock
    private OcrTextExtractor ocrTextExtractor;

    private MultiStageResumeExtractor extractor;

    @BeforeEach
    void setUp() {
        unicodeNormalizer = new UnicodeNormalizer();
        qualityValidator = new ExtractionQualityValidator();
        extractor = new MultiStageResumeExtractor(unicodeNormalizer, qualityValidator, ocrTextExtractor);
    }

    @Test
    void testNormalTextPdf_ExtractsDirectlyViaPdfBox() throws IOException {
        byte[] pdfBytes = createPdfWithText("""
                Atul Sharma
                Email: atul@example.com | Bangalore, India
                
                Summary
                Experienced Software Engineer specializing in Java, Spring Boot, React, and PostgreSQL.
                
                Experience
                Software Engineer at TechCorp | 2022 - Present
                - Developed scalable REST microservices handling 50,000+ daily active users.
                - Reduced query response times by 35% using PostgreSQL indexing.
                
                Education
                Bachelor of Technology in Computer Science | 2018 - 2022
                
                Skills
                Java, Python, C++, React.js, Node.js, Docker, Kubernetes, AWS, Git, SQL
                
                Projects
                CareerOS - AI Placement Platform built with Spring Boot and React.
                """);

        ExtractedResumeContent content = extractor.extract(pdfBytes, "pdf");

        assertNotNull(content);
        assertEquals(ExtractionMethod.PDFBOX_DIRECT, content.getExtractionMethod());
        assertTrue(content.getExtractionStatus() == ExtractionStatus.EXCELLENT || content.getExtractionStatus() == ExtractionStatus.GOOD);
        assertTrue(content.getCleanText().contains("Atul Sharma"));
        assertTrue(content.getCleanText().contains("Spring Boot"));
        assertTrue(content.getCleanText().contains("C++"));
        assertTrue(content.getDetectedSections().contains("Summary"));
        assertTrue(content.getDetectedSections().contains("Experience"));
        assertTrue(content.getDetectedSections().contains("Education"));
        assertTrue(content.getDetectedSections().contains("Skills"));
    }

    @Test
    void testScannedImagePdf_TriggersOcrFallback() throws IOException {
        // Create empty text PDF (simulating scanned/image PDF without text streams)
        byte[] emptyPdfBytes = createEmptyPdf();

        when(ocrTextExtractor.extractTextWithOcr(any())).thenReturn("""
                ATUL SHARMA
                Email: atul@example.com
                
                Summary
                Full Stack Developer with expertise in React, Node.js, and MongoDB.
                
                Experience
                Frontend Developer at WebCorp
                - Built responsive UI using React, TailwindCSS, and TypeScript.
                
                Skills
                JavaScript, TypeScript, React.js, Node.js, HTML, CSS, Git
                """);

        ExtractedResumeContent content = extractor.extract(emptyPdfBytes, "pdf");

        assertNotNull(content);
        assertEquals(ExtractionMethod.OCR_FALLBACK, content.getExtractionMethod());
        assertEquals(ExtractionStatus.OCR_USED, content.getExtractionStatus());
        assertTrue(content.getCleanText().contains("ATUL SHARMA"));
        assertTrue(content.getCleanText().contains("React"));
    }

    @Test
    void testDocxResume_ExtractsParagraphsAndTables() throws IOException {
        byte[] docxBytes = createDocxResume();

        ExtractedResumeContent content = extractor.extract(docxBytes, "docx");

        assertNotNull(content);
        assertEquals(ExtractionMethod.POI_DOCX, content.getExtractionMethod());
        assertNotEquals(ExtractionStatus.FAILED, content.getExtractionStatus());
        assertTrue(content.getCleanText().contains("Priya Patel"));
        assertTrue(content.getCleanText().contains("Python Developer"));
        assertTrue(content.getCleanText().contains("Django"));
    }

    @Test
    void testCorruptedOrEmptyFile_ReturnsSafeFailedState() {
        byte[] corruptBytes = new byte[] { 0, 1, 2, 3, 4, 5 };

        when(ocrTextExtractor.extractTextWithOcr(any())).thenReturn("");

        ExtractedResumeContent content = extractor.extract(corruptBytes, "pdf");

        assertNotNull(content);
        assertEquals(ExtractionStatus.FAILED, content.getExtractionStatus());
        assertEquals(ExtractionMethod.NONE, content.getExtractionMethod());
        assertFalse(content.getWarnings().isEmpty());
    }

    @Test
    void testUnicodeNormalizer_PreservesTechnicalTerms() {
        String input = "Skilled in C++, C#, .NET Core, Node.js, React.js, REST APIs, CI/CD, and fi-ligatures (conﬁguration).";
        String normalized = unicodeNormalizer.normalize(input);

        assertTrue(normalized.contains("C++"));
        assertTrue(normalized.contains("C#"));
        assertTrue(normalized.contains(".NET Core"));
        assertTrue(normalized.contains("Node.js"));
        assertTrue(normalized.contains("React.js"));
        assertTrue(normalized.contains("REST APIs"));
        assertTrue(normalized.contains("CI/CD"));
        assertTrue(normalized.contains("configuration"), "Ligature fi should be converted to 'fi'");
    }

    private byte[] createPdfWithText(String text) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.setLeading(14.0f);
                cs.newLineAtOffset(50, 720);

                String[] lines = text.split("\n");
                for (String line : lines) {
                    cs.showText(line.trim());
                    cs.newLine();
                }
                cs.endText();
            }
            doc.save(baos);
        }
        return baos.toByteArray();
    }

    private byte[] createEmptyPdf() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);
            doc.save(baos);
        }
        return baos.toByteArray();
    }

    private byte[] createDocxResume() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (XWPFDocument doc = new XWPFDocument()) {
            XWPFParagraph p1 = doc.createParagraph();
            XWPFRun r1 = p1.createRun();
            r1.setText("Priya Patel - Python Developer");

            XWPFParagraph p2 = doc.createParagraph();
            XWPFRun r2 = p2.createRun();
            r2.setText("Summary: Experienced backend software engineer with Python and Django.");

            XWPFParagraph p3 = doc.createParagraph();
            XWPFRun r3 = p3.createRun();
            r3.setText("Experience: Senior Developer at TechLabs building scalable cloud solutions.");

            XWPFTable table = doc.createTable(2, 2);
            XWPFTableRow row0 = table.getRow(0);
            row0.getCell(0).setText("Category");
            row0.getCell(1).setText("Technologies");

            XWPFTableRow row1 = table.getRow(1);
            row1.getCell(0).setText("Skills");
            row1.getCell(1).setText("Python, Django, PostgreSQL, Docker, AWS, Git");

            doc.write(baos);
        }
        return baos.toByteArray();
    }
}
