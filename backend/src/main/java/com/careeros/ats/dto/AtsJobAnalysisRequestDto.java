package com.careeros.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsJobAnalysisRequestDto {
    private String jobTitle;
    private String companyName;
    private String jobDescription;
}
