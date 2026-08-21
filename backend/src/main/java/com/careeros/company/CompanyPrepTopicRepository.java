package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyPrepTopicRepository extends JpaRepository<CompanyPreparationTopicEntity, Long> {
    List<CompanyPreparationTopicEntity> findByCompanyId(Long companyId);
}
