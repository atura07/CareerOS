package com.careeros.company.dto;

import com.careeros.company.CompanyPreparationTopicEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyPrepTopicDto {
    private Long id;
    private Long roleId;
    private String subject;
    private String topic;
    private String priority;
    private String estimatedEffort;
    private String resourcesJson;

    public static CompanyPrepTopicDto fromEntity(CompanyPreparationTopicEntity t) {
        return CompanyPrepTopicDto.builder()
                .id(t.getId())
                .roleId(t.getRole() != null ? t.getRole().getId() : null)
                .subject(t.getSubject())
                .topic(t.getTopic())
                .priority(t.getPriority())
                .estimatedEffort(t.getEstimatedEffort())
                .resourcesJson(t.getResourcesJson())
                .build();
    }
}
