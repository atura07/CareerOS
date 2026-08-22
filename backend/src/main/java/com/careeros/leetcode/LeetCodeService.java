package com.careeros.leetcode;

import com.careeros.exception.ResourceNotFoundException;
import com.careeros.leetcode.dto.LeetCodeDataDto;
import com.careeros.leetcode.dto.LeetCodePreviewResponse;
import com.careeros.leetcode.dto.LeetCodeStatusResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class LeetCodeService {

    private static final String GRAPHQL_URL = "https://leetcode.com/graphql";
    private static final long CACHE_TTL_MILLIS = 5 * 60 * 1000; // 5 minutes cache

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final LeetCodeAccountRepository accountRepository;
    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();
    private final Set<Long> activeSyncs = ConcurrentHashMap.newKeySet();

    public LeetCodeService(ObjectMapper objectMapper, LeetCodeAccountRepository accountRepository) {
        this.objectMapper = objectMapper;
        this.accountRepository = accountRepository;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(6))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    private static class CacheEntry {
        final LeetCodeDataDto data;
        final long expiresAt;

        CacheEntry(LeetCodeDataDto data, long expiresAt) {
            this.data = data;
            this.expiresAt = expiresAt;
        }
    }

    private static final String LEETCODE_GRAPHQL_QUERY = """
        query getUserProfile($username: String!) {
          allQuestionsCount {
            difficulty
            count
          }
          matchedUser(username: $username) {
            username
            githubUrl
            twitterUrl
            linkedinUrl
            contestBadge {
              name
              expired
              hoverText
              icon
            }
            profile {
              ranking
              userAvatar
              realName
              aboutMe
              school
              countryName
              company
              jobTitle
              skillTags
              postViewCount
              reputation
              solutionCount
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
              totalSubmissionNum {
                difficulty
                count
              }
            }
            userCalendar {
              streak
              totalActiveDays
              submissionCalendar
              activeYears
            }
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
              name
            }
          }
          userContestRankingHistory(username: $username) {
            attended
            trendDirection
            problemsSolved
            totalProblems
            finishTimeInSeconds
            rating
            ranking
            contest {
              title
              startTime
            }
          }
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              questionId
              questionFrontendId
              title
              titleSlug
              difficulty
            }
          }
          recentAcSubmissionList(username: $username, limit: 15) {
            id
            title
            titleSlug
            timestamp
          }
        }
    """;

    /**
     * Preview a LeetCode user without connecting.
     */
    public LeetCodePreviewResponse previewLeetCodeUser(String rawUsername) {
        if (rawUsername == null || rawUsername.isBlank()) {
            return LeetCodePreviewResponse.builder()
                    .valid(false)
                    .message("Username cannot be empty.")
                    .build();
        }
        String cleanUsername = rawUsername.trim();

        try {
            LeetCodeDataDto data = fetchRawLeetCodeData(cleanUsername);
            return LeetCodePreviewResponse.builder()
                    .valid(true)
                    .username(data.getProfile().getUsername())
                    .avatar(data.getProfile().getAvatar())
                    .ranking(data.getProfile().getRanking())
                    .problemsSolved(data.getStats().getProblemsSolved())
                    .easy(data.getStats().getEasy())
                    .medium(data.getStats().getMedium())
                    .hard(data.getStats().getHard())
                    .contestRating(data.getStats().getContestRating())
                    .message("LeetCode profile found!")
                    .build();
        } catch (ResourceNotFoundException e) {
            return LeetCodePreviewResponse.builder()
                    .valid(false)
                    .username(cleanUsername)
                    .message("LeetCode user \"" + cleanUsername + "\" does not exist.")
                    .build();
        } catch (Exception e) {
            log.error("Error previewing LeetCode user {}: {}", cleanUsername, e.getMessage());
            return LeetCodePreviewResponse.builder()
                    .valid(false)
                    .username(cleanUsername)
                    .message("Unable to verify LeetCode profile: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Get connected LeetCode status and dashboard data for a specific user.
     */
    public LeetCodeStatusResponse getAccountStatus(Long userId) {
        Optional<LeetCodeAccountEntity> optionalAccount = accountRepository.findByUserIdAndConnectedTrue(userId);
        if (optionalAccount.isEmpty()) {
            return LeetCodeStatusResponse.builder()
                    .connected(false)
                    .build();
        }

        LeetCodeAccountEntity account = optionalAccount.get();
        LeetCodeDataDto data = null;

        if (account.getSyncedDataJson() != null && !account.getSyncedDataJson().isBlank()) {
            try {
                data = objectMapper.readValue(account.getSyncedDataJson(), LeetCodeDataDto.class);
            } catch (Exception e) {
                log.warn("Failed to parse cached LeetCode data for user {}: {}", userId, e.getMessage());
            }
        }

        if (data == null) {
            try {
                data = fetchRawLeetCodeData(account.getUsername());
                account.setSyncedDataJson(objectMapper.writeValueAsString(data));
                account.setLastSyncedAt(LocalDateTime.now());
                account.setLastSyncStatus("SUCCESS");
                account.setLastErrorMessage(null);
                accountRepository.save(account);
            } catch (Exception e) {
                log.error("Failed initial data fetch for user {}: {}", userId, e.getMessage());
            }
        }

        return LeetCodeStatusResponse.builder()
                .connected(true)
                .username(account.getUsername())
                .lastSyncedAt(account.getLastSyncedAt())
                .lastSyncStatus(account.getLastSyncStatus())
                .lastErrorMessage(account.getLastErrorMessage())
                .data(data)
                .build();
    }

    /**
     * Connect or update a LeetCode username for a specific user.
     */
    @Transactional
    public LeetCodeStatusResponse connectAccount(Long userId, String rawUsername) {
        if (rawUsername == null || rawUsername.isBlank()) {
            throw new IllegalArgumentException("LeetCode username cannot be blank.");
        }
        String cleanUsername = rawUsername.trim();

        // 1. Verify existence and fetch initial data
        LeetCodeDataDto data = fetchRawLeetCodeData(cleanUsername);

        // 2. Persist in database
        LeetCodeAccountEntity account = accountRepository.findByUserId(userId)
                .orElse(LeetCodeAccountEntity.builder()
                        .userId(userId)
                        .build());

        account.setUsername(data.getProfile().getUsername());
        account.setConnected(true);
        account.setLastSyncedAt(LocalDateTime.now());
        account.setLastSyncStatus("SUCCESS");
        account.setLastErrorMessage(null);

        try {
            account.setSyncedDataJson(objectMapper.writeValueAsString(data));
        } catch (Exception e) {
            log.warn("Could not serialize LeetCode data for persistence: {}", e.getMessage());
        }

        accountRepository.save(account);
        log.info("Successfully connected LeetCode account '{}' for userId={}", cleanUsername, userId);

        return LeetCodeStatusResponse.builder()
                .connected(true)
                .username(account.getUsername())
                .lastSyncedAt(account.getLastSyncedAt())
                .lastSyncStatus(account.getLastSyncStatus())
                .lastErrorMessage(null)
                .data(data)
                .build();
    }

    /**
     * Disconnect LeetCode account for a user.
     */
    @Transactional
    public void disconnectAccount(Long userId) {
        accountRepository.findByUserId(userId).ifPresent(account -> {
            account.setConnected(false);
            accountRepository.save(account);
            log.info("Disconnected LeetCode account for userId={}", userId);
        });
    }

    /**
     * Manually trigger sync for a user's connected LeetCode account.
     */
    public LeetCodeStatusResponse syncAccountData(Long userId) {
        LeetCodeAccountEntity account = accountRepository.findByUserIdAndConnectedTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No connected LeetCode account found for this user."));

        if (!activeSyncs.add(userId)) {
            log.info("Sync already in progress for userId={}", userId);
            return getAccountStatus(userId);
        }

        try {
            // Bypass memory cache during explicit manual sync
            LeetCodeDataDto freshData = fetchFromLeetCodeGraphQL(account.getUsername());

            account.setLastSyncedAt(LocalDateTime.now());
            account.setLastSyncStatus("SUCCESS");
            account.setLastErrorMessage(null);
            account.setSyncedDataJson(objectMapper.writeValueAsString(freshData));
            accountRepository.save(account);

            // Update memory cache
            cache.put(account.getUsername().toLowerCase(), new CacheEntry(freshData, System.currentTimeMillis() + CACHE_TTL_MILLIS));

            return LeetCodeStatusResponse.builder()
                    .connected(true)
                    .username(account.getUsername())
                    .lastSyncedAt(account.getLastSyncedAt())
                    .lastSyncStatus("SUCCESS")
                    .lastErrorMessage(null)
                    .data(freshData)
                    .build();

        } catch (Exception e) {
            log.error("Sync failed for userId={} (username={}): {}", userId, account.getUsername(), e.getMessage());

            account.setLastSyncStatus("FAILED");
            account.setLastErrorMessage(e.getMessage());
            accountRepository.save(account);

            // Fallback to existing cached data in DB
            LeetCodeDataDto existingData = null;
            if (account.getSyncedDataJson() != null && !account.getSyncedDataJson().isBlank()) {
                try {
                    existingData = objectMapper.readValue(account.getSyncedDataJson(), LeetCodeDataDto.class);
                } catch (Exception parseEx) {
                    log.error("Failed to parse fallback cached data: {}", parseEx.getMessage());
                }
            }

            return LeetCodeStatusResponse.builder()
                    .connected(true)
                    .username(account.getUsername())
                    .lastSyncedAt(account.getLastSyncedAt())
                    .lastSyncStatus("FAILED")
                    .lastErrorMessage(e.getMessage())
                    .data(existingData)
                    .build();
        } finally {
            activeSyncs.remove(userId);
        }
    }

    /**
     * Public / Direct fetch with memory cache.
     */
    public LeetCodeDataDto fetchRawLeetCodeData(String username) {
        String cleanUsername = (username == null || username.isBlank()) ? "" : username.trim();
        if (cleanUsername.isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        long now = System.currentTimeMillis();
        CacheEntry cached = cache.get(cleanUsername.toLowerCase());
        if (cached != null && cached.expiresAt > now) {
            return cached.data;
        }

        LeetCodeDataDto freshData = fetchFromLeetCodeGraphQL(cleanUsername);
        cache.put(cleanUsername.toLowerCase(), new CacheEntry(freshData, now + CACHE_TTL_MILLIS));
        return freshData;
    }

    private LeetCodeDataDto fetchFromLeetCodeGraphQL(String username) {
        try {
            Map<String, Object> bodyMap = new HashMap<>();
            bodyMap.put("query", LEETCODE_GRAPHQL_QUERY);
            bodyMap.put("variables", Map.of("username", username));
            String requestPayload = objectMapper.writeValueAsString(bodyMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GRAPHQL_URL))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .header("Referer", "https://leetcode.com")
                    .header("Origin", "https://leetcode.com")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("LeetCode GraphQL returned HTTP {} for user {}", response.statusCode(), username);
                throw new RuntimeException("LeetCode API returned HTTP " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode dataNode = root.path("data");

            JsonNode matchedUser = dataNode.path("matchedUser");
            if (matchedUser.isMissingNode() || matchedUser.isNull()) {
                throw new ResourceNotFoundException("LeetCode user \"" + username + "\" was not found.");
            }

            return mapToDto(username, dataNode);

        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to fetch LeetCode data for user {}: {}", username, e.getMessage());
            throw new RuntimeException("Unable to reach LeetCode API: " + e.getMessage(), e);
        }
    }

    private LeetCodeDataDto mapToDto(String username, JsonNode data) {
        JsonNode userNode = data.path("matchedUser");
        JsonNode profileNode = userNode.path("profile");
        JsonNode statsNode = userNode.path("submitStatsGlobal");
        JsonNode calendarNode = userNode.path("userCalendar");
        JsonNode contestNode = data.path("userContestRanking");
        JsonNode contestHistoryNode = data.path("userContestRankingHistory");
        JsonNode dailyChallengeNode = data.path("activeDailyCodingChallengeQuestion");
        JsonNode recentList = data.path("recentAcSubmissionList");

        // Profile
        String finalUsername = userNode.path("username").asText(username);
        int ranking = profileNode.path("ranking").asInt(0);
        double contestRating = contestNode.path("rating").asDouble(0.0);
        int globalRank = contestNode.path("globalRanking").asInt(ranking);

        LeetCodeDataDto.Profile profile = LeetCodeDataDto.Profile.builder()
                .username(finalUsername)
                .avatar(finalUsername.isEmpty() ? "U" : finalUsername.substring(0, 1).toUpperCase())
                .ranking(ranking)
                .contestRating(Math.round(contestRating * 10.0) / 10.0)
                .globalRank(globalRank)
                .countryRank(0)
                .build();

        // Stats
        int easySolved = 0;
        int mediumSolved = 0;
        int hardSolved = 0;
        int totalSolved = 0;
        int totalSubmissions = 0;

        JsonNode acArray = statsNode.path("acSubmissionNum");
        if (acArray.isArray()) {
            for (JsonNode item : acArray) {
                String diff = item.path("difficulty").asText("");
                int count = item.path("count").asInt(0);
                if ("Easy".equalsIgnoreCase(diff)) easySolved = count;
                else if ("Medium".equalsIgnoreCase(diff)) mediumSolved = count;
                else if ("Hard".equalsIgnoreCase(diff)) hardSolved = count;
                else if ("All".equalsIgnoreCase(diff)) totalSolved = count;
            }
        }
        if (totalSolved == 0) {
            totalSolved = easySolved + mediumSolved + hardSolved;
        }

        JsonNode totalArray = statsNode.path("totalSubmissionNum");
        if (totalArray.isArray()) {
            for (JsonNode item : totalArray) {
                String diff = item.path("difficulty").asText("");
                int count = item.path("count").asInt(0);
                if ("All".equalsIgnoreCase(diff)) totalSubmissions = count;
            }
        }
        if (totalSubmissions == 0) {
            totalSubmissions = totalSolved;
        }

        int acceptanceRate = totalSubmissions > 0 ? (int) Math.round(((double) totalSolved / totalSubmissions) * 100) : 0;
        int streak = calendarNode.path("streak").asInt(0);
        int totalActiveDays = calendarNode.path("totalActiveDays").asInt(0);
        int badges = userNode.path("contestBadge").isNull() ? 0 : 1;

        LeetCodeDataDto.Stats stats = LeetCodeDataDto.Stats.builder()
                .problemsSolved(totalSolved)
                .easy(easySolved)
                .medium(mediumSolved)
                .hard(hardSolved)
                .acceptanceRate(acceptanceRate)
                .submissions(totalSubmissions)
                .badges(badges)
                .currentStreak(streak)
                .longestStreak(Math.max(streak, totalActiveDays))
                .contestRating(Math.round(contestRating * 10.0) / 10.0)
                .build();

        // Daily Challenge
        JsonNode qNode = dailyChallengeNode.path("question");
        String dailyTitle = qNode.path("title").asText("No daily challenge available");
        String dailyDiff = qNode.path("difficulty").asText("Medium");
        String userStatus = dailyChallengeNode.path("userStatus").asText("NotStart");
        String statusMapped = "Finish".equalsIgnoreCase(userStatus) ? "Solved" : "Pending";

        LeetCodeDataDto.DailyChallenge dailyChallenge = LeetCodeDataDto.DailyChallenge.builder()
                .title(dailyTitle)
                .difficulty(dailyDiff)
                .status(statusMapped)
                .build();

        // Recent Problems
        List<LeetCodeDataDto.RecentProblem> recentProblems = new ArrayList<>();
        if (recentList.isArray()) {
            int idx = 1;
            for (JsonNode sub : recentList) {
                long ts = sub.path("timestamp").asLong(0);
                String dateStr = ts > 0
                        ? LocalDate.ofInstant(Instant.ofEpochSecond(ts), ZoneId.of("UTC")).format(DateTimeFormatter.ISO_LOCAL_DATE)
                        : LocalDate.now(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_LOCAL_DATE);
                String problemTitle = sub.path("title").asText("Untitled Problem");
                String titleSlug = sub.path("titleSlug").asText("");
                if (titleSlug.isBlank()) {
                    titleSlug = problemTitle.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
                }
                String problemUrl = "https://leetcode.com/problems/" + titleSlug + "/";

                recentProblems.add(LeetCodeDataDto.RecentProblem.builder()
                        .id(sub.path("id").asLong(idx++))
                        .title(problemTitle)
                        .titleSlug(titleSlug)
                        .url(problemUrl)
                        .difficulty("Medium")
                        .status("Solved")
                        .date(dateStr)
                        .build());
            }
        }

        // Contest History
        List<LeetCodeDataDto.ContestEntry> contestHistory = new ArrayList<>();
        if (contestHistoryNode.isArray()) {
            int idx = 1;
            for (JsonNode entry : contestHistoryNode) {
                if (entry.path("attended").asBoolean(false) || entry.path("rating").asDouble(0) > 0) {
                    double r = entry.path("rating").asDouble(0);
                    int rk = entry.path("ranking").asInt(0);
                    long startTs = entry.path("contest").path("startTime").asLong(0);
                    String contestDate = startTs > 0
                            ? LocalDate.ofInstant(Instant.ofEpochSecond(startTs), ZoneId.of("UTC")).format(DateTimeFormatter.ISO_LOCAL_DATE)
                            : LocalDate.now(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_LOCAL_DATE);

                    contestHistory.add(LeetCodeDataDto.ContestEntry.builder()
                            .id(idx++)
                            .name(entry.path("contest").path("title").asText("Contest"))
                            .rating(Math.round(r * 10.0) / 10.0)
                            .rank(rk)
                            .date(contestDate)
                            .build());
                }
            }
        }

        // Heatmap
        List<LeetCodeDataDto.HeatmapDay> heatmap = new ArrayList<>();
        String submissionCalendarJson = calendarNode.path("submissionCalendar").asText("");
        if (submissionCalendarJson != null && !submissionCalendarJson.isBlank() && !"{}".equals(submissionCalendarJson.trim())) {
            try {
                JsonNode calendarJsonNode = objectMapper.readTree(submissionCalendarJson);
                Iterator<Map.Entry<String, JsonNode>> fields = calendarJsonNode.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> entry = fields.next();
                    long epoch = Long.parseLong(entry.getKey());
                    int count = entry.getValue().asInt(0);
                    String date = LocalDate.ofInstant(Instant.ofEpochSecond(epoch), ZoneId.of("UTC")).format(DateTimeFormatter.ISO_LOCAL_DATE);
                    heatmap.add(new LeetCodeDataDto.HeatmapDay(date, count));
                }
                heatmap.sort(Comparator.comparing(LeetCodeDataDto.HeatmapDay::getDate));
            } catch (Exception e) {
                log.debug("Could not parse submissionCalendar JSON: {}", e.getMessage());
            }
        }

        if (heatmap.isEmpty()) {
            heatmap = generateHeatmapFallback();
        }

        return LeetCodeDataDto.builder()
                .profile(profile)
                .stats(stats)
                .dailyChallenge(dailyChallenge)
                .recentProblems(recentProblems)
                .contestHistory(contestHistory)
                .heatmap(heatmap)
                .build();
    }

    private List<LeetCodeDataDto.HeatmapDay> generateHeatmapFallback() {
        List<LeetCodeDataDto.HeatmapDay> days = new ArrayList<>();
        LocalDate today = LocalDate.now(ZoneId.of("UTC"));
        for (int i = 364; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            days.add(new LeetCodeDataDto.HeatmapDay(d.format(DateTimeFormatter.ISO_LOCAL_DATE), 0));
        }
        return days;
    }
}
