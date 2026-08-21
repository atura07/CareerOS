package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRoleRepository extends JpaRepository<CompanyRoleEntity, Long> {
    List<CompanyRoleEntity> findByCompanyIdAndActiveTrue(Long companyId);
}
