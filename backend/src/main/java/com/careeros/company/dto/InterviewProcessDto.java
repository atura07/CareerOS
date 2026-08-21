package com.careeros.company.dto;

import com.careeros.company.InterviewProcessEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewProcessDto {
    private Long id;
    private Integer roundNumber;
    private String roundName;
    private String roundType;
    private String description;
    private String preparationRequirements;

    public static InterviewProcessDto fromEntity(InterviewProcessEntity p) {
        return InterviewProcessDto.builder()
                .id(p.getId())
                .roundNumber(p.getRoundNumber())
                .roundName(p.getRoundName())
                .roundType(p.getRoundType())
                .description(p.getDescription())
                .preparationRequirements(p.getPreparationRequirements())
                .build();
    }
}
