package com.careeros.resume.extraction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Encapsulates the output and metadata of the multi-stage extraction pipeline.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtractedResumeContent {

    private String rawText;
    private String cleanText;
    private int characterCount;
    private int wordCount;
    private double alphaRatio;
    private ExtractionStatus extractionStatus;
    private ExtractionMethod extractionMethod;
    private double confidenceScore;
    @Builder.Default
    private List<String> detectedSections = new ArrayList<>();
    @Builder.Default
    private List<String> warnings = new ArrayList<>();

    public static ExtractedResumeContent failed(String warning) {
        return ExtractedResumeContent.builder()
                .rawText("")
                .cleanText("")
                .characterCount(0)
                .wordCount(0)
                .alphaRatio(0.0)
                .extractionStatus(ExtractionStatus.FAILED)
                .extractionMethod(ExtractionMethod.NONE)
                .confidenceScore(0.0)
                .detectedSections(new ArrayList<>())
                .warnings(List.of(warning != null ? warning : "Resume parsing failed."))
                .build();
    }
}
