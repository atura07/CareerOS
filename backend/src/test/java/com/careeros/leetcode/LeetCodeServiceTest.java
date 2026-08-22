package com.careeros.leetcode;

import com.careeros.exception.ResourceNotFoundException;
import com.careeros.leetcode.dto.LeetCodeDataDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LeetCodeServiceTest {

    private LeetCodeService leetCodeService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        leetCodeService = new LeetCodeService(objectMapper);
    }

    @Test
    void testGetLeetCodeData_ValidUser() {
        LeetCodeDataDto data = leetCodeService.getLeetCodeData("atul_yadav");
        assertNotNull(data);
        assertNotNull(data.getProfile());
        assertEquals("atul_yadav", data.getProfile().getUsername());
        assertNotNull(data.getStats());
        assertTrue(data.getStats().getProblemsSolved() > 0, "Problems solved should be greater than 0");
        assertTrue(data.getStats().getEasy() > 0, "Easy count should be > 0");
        assertTrue(data.getStats().getMedium() > 0, "Medium count should be > 0");
        assertNotNull(data.getDailyChallenge());
        assertNotNull(data.getHeatmap());
        assertFalse(data.getHeatmap().isEmpty());
    }

    @Test
    void testGetLeetCodeData_NonExistentUser() {
        assertThrows(ResourceNotFoundException.class, () -> {
            leetCodeService.getLeetCodeData("this_user_definitely_does_not_exist_987654321");
        });
    }

    @Test
    void testGetLeetCodeData_DefaultFallback() {
        LeetCodeDataDto data = leetCodeService.getLeetCodeData(null);
        assertNotNull(data);
        assertEquals("atul_yadav", data.getProfile().getUsername());
    }
}
