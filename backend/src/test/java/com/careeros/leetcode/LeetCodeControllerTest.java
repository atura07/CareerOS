package com.careeros.leetcode;

import com.careeros.leetcode.dto.LeetCodeDataDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeetCodeControllerTest {

    @Mock
    private LeetCodeService leetCodeService;

    @InjectMocks
    private LeetCodeController leetCodeController;

    private LeetCodeDataDto mockData;

    @BeforeEach
    void setUp() {
        mockData = LeetCodeDataDto.builder()
                .profile(LeetCodeDataDto.Profile.builder().username("atul_yadav").build())
                .stats(LeetCodeDataDto.Stats.builder().problemsSolved(100).build())
                .build();
    }

    @Test
    void testGetLeetCodeProfile() {
        when(leetCodeService.getLeetCodeData("atul_yadav")).thenReturn(mockData);

        ResponseEntity<LeetCodeDataDto> response = leetCodeController.getLeetCodeProfile("atul_yadav");

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("atul_yadav", response.getBody().getProfile().getUsername());
        verify(leetCodeService, times(1)).getLeetCodeData("atul_yadav");
    }

    @Test
    void testGetLeetCodeDefault() {
        when(leetCodeService.getLeetCodeData("atul_yadav")).thenReturn(mockData);

        ResponseEntity<LeetCodeDataDto> response = leetCodeController.getLeetCodeDefault(null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("atul_yadav", response.getBody().getProfile().getUsername());
        verify(leetCodeService, times(1)).getLeetCodeData("atul_yadav");
    }
}
