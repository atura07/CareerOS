package com.careeros.company.dto;

import com.careeros.company.CompanyEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDto {
    private Long id;
    private String name;
    private String slug;
    private String logoUrl;
    private String website;
    private String description;
    private String industry;
    private String packageInfo;
    private String location;
    private String difficulty;
    private Boolean active;
    private List<String> processSummary;
    private Integer rolesCount;
    private Integer prepTopicsCount;

    public static CompanyDto fromEntity(CompanyEntity c) {
        List<String> rounds = c.getInterviewProcesses() == null
                ? List.of()
                : c.getInterviewProcesses().stream().map(p -> p.getRoundName()).toList();

        return CompanyDto.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .logoUrl(c.getLogoUrl())
                .website(c.getWebsite())
                .description(c.getDescription())
                .industry(c.getIndustry())
                .packageInfo(c.getPackageInfo())
                .location(c.getLocation())
                .difficulty(c.getDifficulty())
                .active(c.getActive())
                .processSummary(rounds)
                .rolesCount(c.getRoles() != null ? c.getRoles().size() : 0)
                .prepTopicsCount(c.getPrepTopics() != null ? c.getPrepTopics().size() : 0)
                .build();
    }
}
