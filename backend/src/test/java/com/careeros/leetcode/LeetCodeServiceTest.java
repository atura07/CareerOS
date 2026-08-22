package com.careeros.leetcode;

import com.careeros.exception.ResourceNotFoundException;
import com.careeros.leetcode.dto.LeetCodeDataDto;
import com.careeros.leetcode.dto.LeetCodePreviewResponse;
import com.careeros.leetcode.dto.LeetCodeStatusResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeetCodeServiceTest {

    @Mock
    private LeetCodeAccountRepository accountRepository;

    private LeetCodeService leetCodeService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        leetCodeService = new LeetCodeService(objectMapper, accountRepository);
    }

    @Test
    void testPreviewLeetCodeUser_ValidUser() {
        LeetCodePreviewResponse preview = leetCodeService.previewLeetCodeUser("atul_yadav");
        assertNotNull(preview);
        assertTrue(preview.isValid());
        assertEquals("atul_yadav", preview.getUsername());
        assertTrue(preview.getProblemsSolved() > 0);
    }

    @Test
    void testPreviewLeetCodeUser_InvalidUser() {
        LeetCodePreviewResponse preview = leetCodeService.previewLeetCodeUser("user_not_existing_9999999_xyz");
        assertNotNull(preview);
        assertFalse(preview.isValid());
    }

    @Test
    void testPreviewLeetCodeUser_EmptyUsername() {
        LeetCodePreviewResponse preview = leetCodeService.previewLeetCodeUser("   ");
        assertNotNull(preview);
        assertFalse(preview.isValid());
    }

    @Test
    void testGetAccountStatus_NotConnected() {
        when(accountRepository.findByUserIdAndConnectedTrue(10L)).thenReturn(Optional.empty());

        LeetCodeStatusResponse status = leetCodeService.getAccountStatus(10L);
        assertNotNull(status);
        assertFalse(status.isConnected());
    }

    @Test
    void testGetAccountStatus_ConnectedWithCachedJson() throws Exception {
        LeetCodeDataDto data = LeetCodeDataDto.builder()
                .profile(LeetCodeDataDto.Profile.builder().username("atul_yadav").ranking(100).build())
                .stats(LeetCodeDataDto.Stats.builder().problemsSolved(500).build())
                .build();
        String json = objectMapper.writeValueAsString(data);

        LeetCodeAccountEntity entity = LeetCodeAccountEntity.builder()
                .id(1L)
                .userId(10L)
                .username("atul_yadav")
                .connected(true)
                .lastSyncedAt(LocalDateTime.now())
                .syncedDataJson(json)
                .build();

        when(accountRepository.findByUserIdAndConnectedTrue(10L)).thenReturn(Optional.of(entity));

        LeetCodeStatusResponse status = leetCodeService.getAccountStatus(10L);
        assertNotNull(status);
        assertTrue(status.isConnected());
        assertEquals("atul_yadav", status.getUsername());
        assertNotNull(status.getData());
        assertEquals(500, status.getData().getStats().getProblemsSolved());
    }

    @Test
    void testConnectAccount_Success() {
        when(accountRepository.findByUserId(10L)).thenReturn(Optional.empty());
        when(accountRepository.save(any(LeetCodeAccountEntity.class))).thenAnswer(i -> i.getArgument(0));

        LeetCodeStatusResponse status = leetCodeService.connectAccount(10L, "atul_yadav");
        assertNotNull(status);
        assertTrue(status.isConnected());
        assertEquals("atul_yadav", status.getUsername());
        assertNotNull(status.getData());
        verify(accountRepository, times(1)).save(any(LeetCodeAccountEntity.class));
    }

    @Test
    void testDisconnectAccount() {
        LeetCodeAccountEntity entity = LeetCodeAccountEntity.builder()
                .id(1L)
                .userId(10L)
                .username("atul_yadav")
                .connected(true)
                .build();

        when(accountRepository.findByUserId(10L)).thenReturn(Optional.of(entity));

        leetCodeService.disconnectAccount(10L);
        assertFalse(entity.isConnected());
        verify(accountRepository, times(1)).save(entity);
    }

    @Test
    void testFetchRawLeetCodeData_ValidUser() {
        LeetCodeDataDto data = leetCodeService.fetchRawLeetCodeData("atul_yadav");
        assertNotNull(data);
        assertNotNull(data.getProfile());
        assertEquals("atul_yadav", data.getProfile().getUsername());
        assertTrue(data.getStats().getProblemsSolved() > 0);
    }
}
