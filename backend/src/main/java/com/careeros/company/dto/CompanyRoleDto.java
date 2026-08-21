package com.careeros.company.dto;

import com.careeros.company.CompanyRoleEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRoleDto {
    private Long id;
    private String title;
    private String location;
    private String experienceLevel;
    private String eligibilityInfo;
    private List<String> requiredSkills;
    private Boolean active;

    public static CompanyRoleDto fromEntity(CompanyRoleEntity r) {
        List<String> skills = (r.getRequiredSkills() != null && !r.getRequiredSkills().isBlank())
                ? Arrays.stream(r.getRequiredSkills().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList()
                : List.of();

        return CompanyRoleDto.builder()
                .id(r.getId())
                .title(r.getTitle())
                .location(r.getLocation())
                .experienceLevel(r.getExperienceLevel())
                .eligibilityInfo(r.getEligibilityInfo())
                .requiredSkills(skills)
                .active(r.getActive())
                .build();
    }
}
