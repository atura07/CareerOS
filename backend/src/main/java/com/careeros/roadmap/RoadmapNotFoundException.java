package com.careeros.roadmap;

/**
 * Thrown when a roadmap is not found or does not belong to the user.
 */
public class RoadmapNotFoundException extends RuntimeException {

    public RoadmapNotFoundException(String message) {
        super(message);
    }
}
