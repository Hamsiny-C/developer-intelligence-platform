package com.hamsiny.developerintelligenceplatform.dto;

public class RoleMatchResponse {

    private String role;
    private int score;

    public RoleMatchResponse() {
    }

    public RoleMatchResponse(String role, int score) {
        this.role = role;
        this.score = score;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}