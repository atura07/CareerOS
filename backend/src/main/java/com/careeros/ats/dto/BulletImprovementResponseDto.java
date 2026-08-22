package com.careeros.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulletImprovementResponseDto {

    private String originalBullet;
    private String improvedBullet;
    private List<String> alternativeVariations;
    private String actionVerbUsed;
    private String impactFormula; // e.g. "[Action Verb] + [Engineered Feature] + [Tech Stack] + [Measurable Outcome]"
    private List<String> metricsPlaceholderPrompts; // questions to help user add real metrics without fabricating
    private String feedback;
}
