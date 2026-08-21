package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCompanyPrepRepository extends JpaRepository<UserCompanyPreparationEntity, Long> {

    List<UserCompanyPreparationEntity> findByUserId(Long userId);

    Optional<UserCompanyPreparationEntity> findByUserIdAndCompanyId(Long userId, Long companyId);

    @Query("SELECT ucp FROM UserCompanyPreparationEntity ucp LEFT JOIN FETCH ucp.tasks t LEFT JOIN FETCH t.topic WHERE ucp.userId = :userId AND ucp.company.slug = :companySlug")
    Optional<UserCompanyPreparationEntity> findByUserIdAndCompanySlugWithTasks(Long userId, String companySlug);
}
