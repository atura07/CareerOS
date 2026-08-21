package com.careeros.company.dto;

import com.careeros.company.UserPreparationTaskEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrepTaskDto {
    private Long id;
    private Long topicId;
    private String subject;
    private String topic;
    private String priority;
    private String estimatedEffort;
    private String status;
    private LocalDateTime completedDate;
    private String notes;

    public static UserPrepTaskDto fromEntity(UserPreparationTaskEntity t) {
        return UserPrepTaskDto.builder()
                .id(t.getId())
                .topicId(t.getTopic() != null ? t.getTopic().getId() : null)
                .subject(t.getTopic() != null ? t.getTopic().getSubject() : "")
                .topic(t.getTopic() != null ? t.getTopic().getTopic() : "")
                .priority(t.getTopic() != null ? t.getTopic().getPriority() : "Medium")
                .estimatedEffort(t.getTopic() != null ? t.getTopic().getEstimatedEffort() : "")
                .status(t.getStatus())
                .completedDate(t.getCompletedDate())
                .notes(t.getNotes())
                .build();
    }
}
