package com.careeros.company;

import com.careeros.company.dto.*;

import java.util.List;

public interface CompanyService {
    List<CompanyDto> getAllCompanies();
    CompanyDetailDto getCompanyBySlug(String slug);
    UserCompanyPrepDto getUserPreparation(Long userId, String slug);
    UserCompanyPrepDto startUserPreparation(Long userId, String slug, StartPrepRequest request);
    UserCompanyPrepDto togglePreparationTask(Long userId, String slug, Long topicId, String status);
}
