package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Long> {

    List<CompanyEntity> findByActiveTrueOrderByNameAsc();

    Optional<CompanyEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
