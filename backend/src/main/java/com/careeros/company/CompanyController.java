package com.careeros.company;

import com.careeros.company.dto.*;
import com.careeros.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        log.info("[COMPANIES] Fetching all active companies...");
        List<CompanyDto> list = companyService.getAllCompanies();
        log.info("[COMPANIES] Found {} active companies", list.size());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CompanyDetailDto> getCompanyBySlug(@PathVariable String slug) {
        log.info("[COMPANIES] Fetching details for slug: {}", slug);
        return ResponseEntity.ok(companyService.getCompanyBySlug(slug));
    }

    @GetMapping("/{slug}/preparation")
    public ResponseEntity<UserCompanyPrepDto> getUserPreparation(
            @PathVariable String slug,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.ok(null);
        }
        return ResponseEntity.ok(companyService.getUserPreparation(user.getId(), slug));
    }

    @PostMapping("/{slug}/preparation/start")
    public ResponseEntity<UserCompanyPrepDto> startPreparation(
            @PathVariable String slug,
            @RequestBody(required = false) StartPrepRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(companyService.startUserPreparation(user.getId(), slug, request));
    }

    @PostMapping("/{slug}/preparation/tasks/{topicId}/toggle")
    public ResponseEntity<UserCompanyPrepDto> toggleTask(
            @PathVariable String slug,
            @PathVariable Long topicId,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(companyService.togglePreparationTask(user.getId(), slug, topicId, status));
    }
}
