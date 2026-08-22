package com.careeros.leetcode.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeetCodePreviewResponse {
    private boolean valid;
    private String username;
    private String avatar;
    private int ranking;
    private int problemsSolved;
    private int easy;
    private int medium;
    private int hard;
    private double contestRating;
    private String message;
}
