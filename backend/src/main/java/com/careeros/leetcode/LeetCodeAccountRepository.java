package com.careeros.leetcode;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeetCodeAccountRepository extends JpaRepository<LeetCodeAccountEntity, Long> {

    Optional<LeetCodeAccountEntity> findByUserId(Long userId);

    Optional<LeetCodeAccountEntity> findByUserIdAndConnectedTrue(Long userId);

    Optional<LeetCodeAccountEntity> findByUsername(String username);

    void deleteByUserId(Long userId);
}
