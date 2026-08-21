package com.careeros.company.dto;

import com.careeros.company.UserCompanyPreparationEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCompanyPrepDto {
    private Long id;
    private Long userId;
    private Long companyId;
    private String companyName;
    private String companySlug;
    private Long roleId;
    private String roleTitle;
    private String status;
    private LocalDateTime startedDate;
    private LocalDate targetDate;
    private Integer progressPercentage;
    private Integer completedTasksCount;
    private Integer totalTasksCount;
    private List<UserPrepTaskDto> tasks;

    public static UserCompanyPrepDto fromEntity(UserCompanyPreparationEntity p) {
        List<UserPrepTaskDto> taskDtos = p.getTasks() != null
                ? p.getTasks().stream().map(UserPrepTaskDto::fromEntity).toList()
                : List.of();

        long completed = taskDtos.stream().filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus())).count();

        return UserCompanyPrepDto.builder()
                .id(p.getId())
                .userId(p.getUserId())
                .companyId(p.getCompany() != null ? p.getCompany().getId() : null)
                .companyName(p.getCompany() != null ? p.getCompany().getName() : "")
                .companySlug(p.getCompany() != null ? p.getCompany().getSlug() : "")
                .roleId(p.getRole() != null ? p.getRole().getId() : null)
                .roleTitle(p.getRole() != null ? p.getRole().getTitle() : null)
                .status(p.getStatus())
                .startedDate(p.getStartedDate())
                .targetDate(p.getTargetDate())
                .progressPercentage(p.getProgressPercentage())
                .completedTasksCount((int) completed)
                .totalTasksCount(taskDtos.size())
                .tasks(taskDtos)
                .build();
    }
}
