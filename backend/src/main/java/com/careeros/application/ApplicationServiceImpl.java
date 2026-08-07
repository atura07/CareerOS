package com.careeros.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of job application CRUD operations.
 */
@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getUserApplications(Long userId) {
        return applicationRepository.findByUserIdOrderByLastUpdatedDesc(userId)
                .stream()
                .map(ApplicationResponse::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplication(Long id, Long userId) {
        ApplicationEntity entity = findOwned(id, userId);
        return ApplicationResponse.fromEntity(entity);
    }

    @Override
    public ApplicationResponse createApplication(Long userId, ApplicationRequest request) {
        ApplicationEntity entity = new ApplicationEntity();
        entity.setUserId(userId);
        applyRequest(entity, request);
        ApplicationEntity saved = applicationRepository.save(entity);
        return ApplicationResponse.fromEntity(saved);
    }

    @Override
    public ApplicationResponse updateApplication(Long id, Long userId, ApplicationRequest request) {
        ApplicationEntity entity = findOwned(id, userId);
        applyRequest(entity, request);
        ApplicationEntity saved = applicationRepository.save(entity);
        return ApplicationResponse.fromEntity(saved);
    }

    @Override
    public void deleteApplication(Long id, Long userId) {
        ApplicationEntity entity = findOwned(id, userId);
        applicationRepository.delete(entity);
    }

    private ApplicationEntity findOwned(Long id, Long userId) {
        ApplicationEntity entity = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException(
                        "Application not found with id: " + id));
        if (!entity.getUserId().equals(userId)) {
            throw new ApplicationNotFoundException("Application not found with id: " + id);
        }
        return entity;
    }

    private void applyRequest(ApplicationEntity entity, ApplicationRequest r) {
        entity.setCompanyName(r.getCompanyName());
        entity.setCompanyLogo(r.getCompanyLogo() == null ? "?" : r.getCompanyLogo());
        entity.setRole(r.getRole());
        entity.setPackageValue(r.getPackageValue());
        entity.setLocation(r.getLocation());
        entity.setAppliedDate(r.getAppliedDate());
        entity.setLastUpdated(r.getLastUpdated());
        entity.setStatus(r.getStatus());
        entity.setNextRound(r.getNextRound());
        entity.setNotes(r.getNotes());
        entity.setRecruiter(r.getRecruiter());
        entity.setRecruiterEmail(r.getRecruiterEmail());
        entity.setApplicationLink(r.getApplicationLink());
        entity.setDeadline(r.getDeadline());
        entity.setPriority(r.getPriority());
    }
}
