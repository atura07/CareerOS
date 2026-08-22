package com.careeros.leetcode;

import com.careeros.leetcode.dto.ConnectLeetCodeRequest;
import com.careeros.leetcode.dto.LeetCodeDataDto;
import com.careeros.leetcode.dto.LeetCodePreviewResponse;
import com.careeros.leetcode.dto.LeetCodeStatusResponse;
import com.careeros.user.User;
import com.careeros.user.UserRepository;
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

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LeetCodeController leetCodeController;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(10L)
                .email("test@example.com")
                .fullName("Test User")
                .build();
    }

    @Test
    void testGetAccountStatus() {
        LeetCodeStatusResponse mockStatus = LeetCodeStatusResponse.builder()
                .connected(true)
                .username("atul_yadav")
                .build();

        when(leetCodeService.getAccountStatus(10L)).thenReturn(mockStatus);

        ResponseEntity<LeetCodeStatusResponse> response = leetCodeController.getAccountStatus(null, mockUser, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isConnected());
        assertEquals("atul_yadav", response.getBody().getUsername());
        verify(leetCodeService, times(1)).getAccountStatus(10L);
    }

    @Test
    void testPreviewLeetCodeUser() {
        LeetCodePreviewResponse mockPreview = LeetCodePreviewResponse.builder()
                .valid(true)
                .username("atul_yadav")
                .problemsSolved(900)
                .build();

        when(leetCodeService.previewLeetCodeUser("atul_yadav")).thenReturn(mockPreview);

        ConnectLeetCodeRequest req = ConnectLeetCodeRequest.builder().username("atul_yadav").build();
        ResponseEntity<LeetCodePreviewResponse> response = leetCodeController.previewLeetCodeUser(req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isValid());
        assertEquals("atul_yadav", response.getBody().getUsername());
        verify(leetCodeService, times(1)).previewLeetCodeUser("atul_yadav");
    }

    @Test
    void testConnectAccount() {
        LeetCodeStatusResponse mockStatus = LeetCodeStatusResponse.builder()
                .connected(true)
                .username("atul_yadav")
                .build();

        when(leetCodeService.connectAccount(10L, "atul_yadav")).thenReturn(mockStatus);

        ConnectLeetCodeRequest req = ConnectLeetCodeRequest.builder().username("atul_yadav").build();
        ResponseEntity<LeetCodeStatusResponse> response = leetCodeController.connectAccount(req, null, mockUser, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isConnected());
        verify(leetCodeService, times(1)).connectAccount(10L, "atul_yadav");
    }

    @Test
    void testDisconnectAccount() {
        doNothing().when(leetCodeService).disconnectAccount(10L);

        ResponseEntity<Void> response = leetCodeController.disconnectAccount(null, mockUser, null);

        assertNotNull(response);
        assertEquals(204, response.getStatusCode().value());
        verify(leetCodeService, times(1)).disconnectAccount(10L);
    }

    @Test
    void testSyncAccountData() {
        LeetCodeStatusResponse mockStatus = LeetCodeStatusResponse.builder()
                .connected(true)
                .username("atul_yadav")
                .lastSyncStatus("SUCCESS")
                .build();

        when(leetCodeService.syncAccountData(10L)).thenReturn(mockStatus);

        ResponseEntity<LeetCodeStatusResponse> response = leetCodeController.syncAccountData(null, mockUser, null);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("SUCCESS", response.getBody().getLastSyncStatus());
        verify(leetCodeService, times(1)).syncAccountData(10L);
    }

    @Test
    void testGetPublicProfile() {
        LeetCodeDataDto data = LeetCodeDataDto.builder()
                .profile(LeetCodeDataDto.Profile.builder().username("atul_yadav").build())
                .build();

        when(leetCodeService.fetchRawLeetCodeData("atul_yadav")).thenReturn(data);

        ResponseEntity<LeetCodeDataDto> response = leetCodeController.getPublicProfile("atul_yadav");

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("atul_yadav", response.getBody().getProfile().getUsername());
    }
}
