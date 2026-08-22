package com.careeros.ats.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulletImprovementRequestDto {

    private String originalBullet;
    private String targetRole; // e.g. "Software Engineer"
    private String contextTech; // e.g. "Spring Boot, PostgreSQL"
}
