package com.careeros.resume;

import com.careeros.resume.extraction.ExtractedResumeContent;
import com.careeros.resume.extraction.ExtractionMethod;
import com.careeros.resume.extraction.ExtractionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private ResumeStorageService storageService;
    @Mock
    private ResumeParserService parserService;
    @Mock
    private ResumeRepository resumeRepository;

    private ResumeService resumeService;

    @BeforeEach
    void setUp() {
        resumeService = new ResumeService(storageService, parserService, resumeRepository);
    }

    @Test
    void testUploadResume_StoresFileDataInEntity() throws IOException {
        byte[] pdfBytes = "PDF test content with Java and Spring Boot".getBytes();
        MockMultipartFile multipartFile = new MockMultipartFile(
                "file", "resume.pdf", "application/pdf", pdfBytes
        );

        ResumeMetadata metadata = new ResumeMetadata("resume.pdf", "stored-123.pdf", (long) pdfBytes.length, "pdf");
        when(storageService.storeFile(any())).thenReturn(metadata);

        ExtractedResumeContent extractedContent = ExtractedResumeContent.builder()
                .rawText("PDF test content with Java and Spring Boot")
                .cleanText("PDF test content with Java and Spring Boot")
                .characterCount(43)
                .wordCount(7)
                .alphaRatio(0.85)
                .extractionStatus(ExtractionStatus.EXCELLENT)
                .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                .confidenceScore(0.95)
                .detectedSections(List.of("Skills"))
                .build();
        when(parserService.extractContent(any(), eq("pdf"))).thenReturn(extractedContent);

        when(resumeRepository.findByUserIdOrderByUploadDateDesc(1L)).thenReturn(List.of());
        when(resumeRepository.save(any(ResumeEntity.class))).thenAnswer(invocation -> {
            ResumeEntity entity = invocation.getArgument(0);
            entity.setId(10L);
            return entity;
        });

        ResumeResponse response = resumeService.uploadResume(multipartFile, 1L);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("resume.pdf", response.getOriginalFileName());

        verify(resumeRepository).save(argThat(entity ->
                entity.getFileData() != null &&
                entity.getFileData().length == pdfBytes.length &&
                entity.getExtractedText().contains("Java")
        ));
    }

    @Test
    void testHealExtractedText_UsesDurableDatabaseFileDataWhenDiskMissing() {
        byte[] pdfBytes = "Sample resume bytes in database".getBytes();
        ResumeEntity entity = new ResumeEntity(1L, "resume.pdf", "missing-disk-file.pdf", 100L, "pdf");
        entity.setId(20L);
        entity.setFileData(pdfBytes);
        entity.setExtractedText(null); // Needs healing

        ExtractedResumeContent healedContent = ExtractedResumeContent.builder()
                .rawText("Healed resume content with Software Engineering")
                .cleanText("Healed resume content with Software Engineering")
                .characterCount(47)
                .wordCount(5)
                .alphaRatio(0.90)
                .extractionStatus(ExtractionStatus.GOOD)
                .extractionMethod(ExtractionMethod.PDFBOX_DIRECT)
                .confidenceScore(0.85)
                .detectedSections(List.of("Experience"))
                .build();
        when(parserService.extractContent(pdfBytes, "pdf")).thenReturn(healedContent);
        when(resumeRepository.save(any(ResumeEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        ResumeEntity result = resumeService.healExtractedTextIfNecessary(entity);

        assertNotNull(result);
        assertEquals("Healed resume content with Software Engineering", result.getExtractedText());
        verify(parserService).extractContent(pdfBytes, "pdf");
        verify(resumeRepository).save(entity);
    }
}
