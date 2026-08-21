package com.careeros.company;

import com.careeros.company.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private CompanyRoleRepository companyRoleRepository;

    @Mock
    private CompanyPrepTopicRepository companyPrepTopicRepository;

    @Mock
    private UserCompanyPrepRepository userCompanyPrepRepository;

    @Mock
    private UserPrepTaskRepository userPrepTaskRepository;

    @InjectMocks
    private CompanyServiceImpl companyService;

    private CompanyEntity testCompany;

    @BeforeEach
    void setUp() {
        testCompany = CompanyEntity.builder()
                .id(1L)
                .name("Google")
                .slug("google")
                .industry("Technology")
                .difficulty("Hard")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();
    }

    @Test
    void testGetAllCompanies() {
        when(companyRepository.findByActiveTrueOrderByNameAsc()).thenReturn(List.of(testCompany));

        List<CompanyDto> result = companyService.getAllCompanies();

        assertEquals(1, result.size());
        assertEquals("Google", result.get(0).getName());
        assertEquals("google", result.get(0).getSlug());
    }

    @Test
    void testGetCompanyBySlug() {
        when(companyRepository.findBySlug("google")).thenReturn(Optional.of(testCompany));

        CompanyDetailDto result = companyService.getCompanyBySlug("google");

        assertNotNull(result);
        assertEquals("Google", result.getName());
    }

    @Test
    void testStartUserPreparation() {
        when(companyRepository.findBySlug("google")).thenReturn(Optional.of(testCompany));
        when(userCompanyPrepRepository.findByUserIdAndCompanyId(1L, 1L)).thenReturn(Optional.empty());
        when(userCompanyPrepRepository.save(any(UserCompanyPreparationEntity.class)))
                .thenAnswer(inv -> {
                    UserCompanyPreparationEntity u = inv.getArgument(0);
                    u.setId(10L);
                    return u;
                });

        UserCompanyPrepDto result = companyService.startUserPreparation(1L, "google", new StartPrepRequest());

        assertNotNull(result);
        assertEquals("google", result.getCompanySlug());
        assertEquals("IN_PROGRESS", result.getStatus());
    }
}
