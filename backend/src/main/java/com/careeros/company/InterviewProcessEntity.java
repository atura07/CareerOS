package com.careeros.company;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_interview_processes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewProcessEntity {

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

    @Column(name = "round_number", nullable = false)
    private Integer roundNumber;

    @Column(name = "round_name", nullable = false)
    private String roundName;

    @Column(name = "round_type", nullable = false, length = 50)
    private String roundType; // ONLINE_ASSESSMENT, DSA, TECHNICAL, HR, BEHAVIORAL, RESUME, MIXED, SYSTEM_DESIGN

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "preparation_requirements", columnDefinition = "TEXT")
    private String preparationRequirements;
}
