package com.careeros.company;

import com.careeros.company.dto.*;
import com.careeros.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyRoleRepository companyRoleRepository;
    private final CompanyPrepTopicRepository companyPrepTopicRepository;
    private final UserCompanyPrepRepository userCompanyPrepRepository;
    private final UserPrepTaskRepository userPrepTaskRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDto> getAllCompanies() {
        List<CompanyEntity> companies = companyRepository.findByActiveTrueOrderByNameAsc();
        for (CompanyEntity c : companies) {
            if (c.getRoles() != null) c.getRoles().size();
            if (c.getInterviewProcesses() != null) c.getInterviewProcesses().size();
            if (c.getPrepTopics() != null) c.getPrepTopics().size();
        }
        return companies.stream()
                .map(CompanyDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDetailDto getCompanyBySlug(String slug) {
        CompanyEntity company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with slug: " + slug));
        if (company.getRoles() != null) company.getRoles().size();
        if (company.getInterviewProcesses() != null) company.getInterviewProcesses().size();
        if (company.getPrepTopics() != null) company.getPrepTopics().size();
        return CompanyDetailDto.fromEntity(company);
    }

    @Override
    @Transactional(readOnly = true)
    public UserCompanyPrepDto getUserPreparation(Long userId, String slug) {
        Optional<UserCompanyPreparationEntity> prepOpt = userCompanyPrepRepository
                .findByUserIdAndCompanySlugWithTasks(userId, slug);

        if (prepOpt.isEmpty()) {
            return null;
        }
        return UserCompanyPrepDto.fromEntity(prepOpt.get());
    }

    @Override
    public UserCompanyPrepDto startUserPreparation(Long userId, String slug, StartPrepRequest request) {
        CompanyEntity company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with slug: " + slug));

        CompanyRoleEntity role = null;
        if (request != null && request.getRoleId() != null) {
            role = companyRoleRepository.findById(request.getRoleId()).orElse(null);
        }

        Optional<UserCompanyPreparationEntity> existingOpt = userCompanyPrepRepository
                .findByUserIdAndCompanyId(userId, company.getId());

        UserCompanyPreparationEntity prep;
        if (existingOpt.isPresent()) {
            prep = existingOpt.get();
            if (role != null) {
                prep.setRole(role);
            }
            if (request != null && request.getTargetDate() != null) {
                prep.setTargetDate(request.getTargetDate());
            }
            prep.setStatus("IN_PROGRESS");
        } else {
            prep = UserCompanyPreparationEntity.builder()
                    .userId(userId)
                    .company(company)
                    .role(role)
                    .status("IN_PROGRESS")
                    .startedDate(LocalDateTime.now())
                    .targetDate(request != null ? request.getTargetDate() : null)
                    .progressPercentage(0)
                    .tasks(new ArrayList<>())
                    .build();
            prep = userCompanyPrepRepository.save(prep);

            // Populate initial tasks from company topics
            List<CompanyPreparationTopicEntity> topics = company.getPrepTopics();
            if (topics != null) {
                for (CompanyPreparationTopicEntity topic : topics) {
                    UserPreparationTaskEntity task = UserPreparationTaskEntity.builder()
                            .userId(userId)
                            .preparation(prep)
                            .topic(topic)
                            .status("PENDING")
                            .build();
                    userPrepTaskRepository.save(task);
                    prep.getTasks().add(task);
                }
            }
        }

        recalculateProgress(prep);
        return UserCompanyPrepDto.fromEntity(prep);
    }

    @Override
    public UserCompanyPrepDto togglePreparationTask(Long userId, String slug, Long topicId, String status) {
        CompanyEntity company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with slug: " + slug));

        UserCompanyPreparationEntity prep = userCompanyPrepRepository
                .findByUserIdAndCompanyId(userId, company.getId())
                .orElseGet(() -> {
                    // Auto-start prep if not started yet
                    return userCompanyPrepRepository.save(UserCompanyPreparationEntity.builder()
                            .userId(userId)
                            .company(company)
                            .status("IN_PROGRESS")
                            .startedDate(LocalDateTime.now())
                            .progressPercentage(0)
                            .tasks(new ArrayList<>())
                            .build());
                });

        UserPreparationTaskEntity task = userPrepTaskRepository
                .findByPreparationIdAndTopicId(prep.getId(), topicId)
                .orElseGet(() -> {
                    CompanyPreparationTopicEntity topic = companyPrepTopicRepository.findById(topicId)
                            .orElseThrow(() -> new ResourceNotFoundException("Topic not found with id: " + topicId));
                    UserPreparationTaskEntity newTask = UserPreparationTaskEntity.builder()
                            .userId(userId)
                            .preparation(prep)
                            .topic(topic)
                            .status("PENDING")
                            .build();
                    return userPrepTaskRepository.save(newTask);
                });

        String newStatus = (status != null && !status.isBlank())
                ? status.toUpperCase()
                : ("COMPLETED".equalsIgnoreCase(task.getStatus()) ? "PENDING" : "COMPLETED");

        task.setStatus(newStatus);
        task.setCompletedDate("COMPLETED".equalsIgnoreCase(newStatus) ? LocalDateTime.now() : null);
        userPrepTaskRepository.save(task);

        // Refresh and recalculate progress
        UserCompanyPreparationEntity reloaded = userCompanyPrepRepository
                .findByUserIdAndCompanySlugWithTasks(userId, slug)
                .orElse(prep);

        recalculateProgress(reloaded);
        return UserCompanyPrepDto.fromEntity(reloaded);
    }

    private void recalculateProgress(UserCompanyPreparationEntity prep) {
        if (prep.getTasks() == null || prep.getTasks().isEmpty()) {
            prep.setProgressPercentage(0);
            return;
        }

        long total = prep.getTasks().size();
        long completed = prep.getTasks().stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();

        int percentage = (int) Math.round(((double) completed / total) * 100);
        prep.setProgressPercentage(percentage);

        if (percentage >= 100) {
            prep.setStatus("COMPLETED");
        } else if (percentage > 0) {
            prep.setStatus("IN_PROGRESS");
        }

        userCompanyPrepRepository.save(prep);
    }
}
