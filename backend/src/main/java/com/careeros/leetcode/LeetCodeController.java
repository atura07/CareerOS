package com.careeros.leetcode;

import com.careeros.leetcode.dto.LeetCodeDataDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/leetcode")
@RequiredArgsConstructor
public class LeetCodeController {

    private final LeetCodeService leetCodeService;

    @GetMapping("/{username}")
    public ResponseEntity<LeetCodeDataDto> getLeetCodeProfile(@PathVariable String username) {
        log.info("Fetching LeetCode data for username: {}", username);
        LeetCodeDataDto data = leetCodeService.getLeetCodeData(username);
        return ResponseEntity.ok(data);
    }

    @GetMapping
    public ResponseEntity<LeetCodeDataDto> getLeetCodeDefault(@RequestParam(required = false) String username) {
        String target = (username == null || username.isBlank()) ? "atul_yadav" : username;
        log.info("Fetching LeetCode default data for: {}", target);
        LeetCodeDataDto data = leetCodeService.getLeetCodeData(target);
        return ResponseEntity.ok(data);
    }
}
