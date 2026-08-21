package com.careeros.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPrepTaskRepository extends JpaRepository<UserPreparationTaskEntity, Long> {

    List<UserPreparationTaskEntity> findByPreparationId(Long preparationId);

    Optional<UserPreparationTaskEntity> findByUserIdAndTopicId(Long userId, Long topicId);

    Optional<UserPreparationTaskEntity> findByPreparationIdAndTopicId(Long preparationId, Long topicId);
}
