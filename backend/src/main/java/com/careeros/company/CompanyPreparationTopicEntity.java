package com.careeros.company;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_prep_topics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPreparationTopicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @JsonIgnore
    private CompanyEntity company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    @JsonIgnore
    private CompanyRoleEntity role;

    @Column(nullable = false, length = 100)
    private String subject; // DSA, System Design, Core CS, Behavioral, etc.

    @Column(nullable = false)
    private String topic;

    @Column(length = 50)
    @Builder.Default
    private String priority = "Medium"; // High, Medium, Low

    @Column(name = "estimated_effort", length = 100)
    private String estimatedEffort;

    @Column(name = "resources_json", columnDefinition = "TEXT")
    private String resourcesJson;
}
