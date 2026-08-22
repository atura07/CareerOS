package com.careeros.leetcode.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeetCodeDataDto {
    private Profile profile;
    private Stats stats;
    private DailyChallenge dailyChallenge;
    private List<RecentProblem> recentProblems;
    private List<ContestEntry> contestHistory;
    private List<HeatmapDay> heatmap;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Profile {
        private String username;
        private String avatar;
        private int ranking;
        private double contestRating;
        private int globalRank;
        private int countryRank;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Stats {
        private int problemsSolved;
        private int easy;
        private int medium;
        private int hard;
        private int acceptanceRate;
        private int submissions;
        private int badges;
        private int currentStreak;
        private int longestStreak;
        private double contestRating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyChallenge {
        private String title;
        private String difficulty;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentProblem {
        private long id;
        private String title;
        private String titleSlug;
        private String url;
        private String difficulty;
        private String status;
        private String date;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContestEntry {
        private long id;
        private String name;
        private double rating;
        private int rank;
        private String date;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HeatmapDay {
        private String date;
        private int count;
    }
}
