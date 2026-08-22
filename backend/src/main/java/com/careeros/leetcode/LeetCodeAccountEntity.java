package com.careeros.leetcode;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_leetcode_accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeetCodeAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Builder.Default
    @Column(nullable = false)
    private boolean connected = true;

    private LocalDateTime lastSyncedAt;

    @Builder.Default
    @Column(length = 50)
    private String lastSyncStatus = "SUCCESS";

    @Column(columnDefinition = "TEXT")
    private String lastErrorMessage;

    @Column(columnDefinition = "TEXT")
    private String syncedDataJson;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
