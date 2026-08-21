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
public class CompanyDetailDto {
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
    private List<CompanyRoleDto> roles;
    private List<InterviewProcessDto> interviewProcesses;
    private List<CompanyPrepTopicDto> prepTopics;

    public static CompanyDetailDto fromEntity(CompanyEntity c) {
        List<CompanyRoleDto> roleDtos = c.getRoles() != null
                ? c.getRoles().stream().map(CompanyRoleDto::fromEntity).toList()
                : List.of();

        List<InterviewProcessDto> processDtos = c.getInterviewProcesses() != null
                ? c.getInterviewProcesses().stream().map(InterviewProcessDto::fromEntity).toList()
                : List.of();

        List<CompanyPrepTopicDto> topicDtos = c.getPrepTopics() != null
                ? c.getPrepTopics().stream().map(CompanyPrepTopicDto::fromEntity).toList()
                : List.of();

        return CompanyDetailDto.builder()
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
                .roles(roleDtos)
                .interviewProcesses(processDtos)
                .prepTopics(topicDtos)
                .build();
    }
}
