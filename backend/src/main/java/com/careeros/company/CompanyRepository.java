package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Long> {

    List<CompanyEntity> findByActiveTrueOrderByNameAsc();

    Optional<CompanyEntity> findBySlug(String slug);

    @Query("SELECT DISTINCT c FROM CompanyEntity c LEFT JOIN FETCH c.roles LEFT JOIN FETCH c.interviewProcesses LEFT JOIN FETCH c.prepTopics WHERE c.slug = :slug")
    Optional<CompanyEntity> findBySlugWithDetails(String slug);

    boolean existsBySlug(String slug);
}
