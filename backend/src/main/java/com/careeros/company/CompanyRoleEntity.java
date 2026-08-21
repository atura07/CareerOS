package com.careeros.company;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "company_roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private CompanyEntity company;

    @Column(nullable = false)
    private String title;

    @Column(length = 255)
    private String location;

    @Column(name = "experience_level", length = 100)
    private String experienceLevel;

    @Column(name = "eligibility_info", columnDefinition = "TEXT")
    private String eligibilityInfo;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
