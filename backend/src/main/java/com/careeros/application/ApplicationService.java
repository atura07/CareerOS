package com.careeros.application;

import java.util.List;

/**
 * Service contract for job application CRUD operations.
 */
public interface ApplicationService {

    List<ApplicationResponse> getUserApplications(Long userId);

    ApplicationResponse getApplication(Long id, Long userId);

    ApplicationResponse createApplication(Long userId, ApplicationRequest request);

    ApplicationResponse updateApplication(Long id, Long userId, ApplicationRequest request);

    void deleteApplication(Long id, Long userId);
}
