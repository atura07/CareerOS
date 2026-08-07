package com.careeros.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, Long> {

    List<ApplicationEntity> findByUserIdOrderByLastUpdatedDesc(Long userId);

    List<ApplicationEntity> findByUserId(Long userId);
}
