package com.hamsiny.developerintelligenceplatform.dto;

import java.util.List;

public class ResumeUploadResponse {

    private int overallAtsScore;
    private String bestRole;
    private String matchLevel;
    private List<RoleMatchResponse> roleMatches;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> suggestions;

    public ResumeUploadResponse() {
    }

    public ResumeUploadResponse(int overallAtsScore,
                                String bestRole,
                                String matchLevel,
                                List<RoleMatchResponse> roleMatches,
                                List<String> matchedSkills,
                                List<String> missingSkills,
                                List<String> suggestions) {
        this.overallAtsScore = overallAtsScore;
        this.bestRole = bestRole;
        this.matchLevel = matchLevel;
        this.roleMatches = roleMatches;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.suggestions = suggestions;
    }

    public int getOverallAtsScore() {
        return overallAtsScore;
    }

    public String getBestRole() {
        return bestRole;
    }

    public String getMatchLevel() {
        return matchLevel;
    }

    public List<RoleMatchResponse> getRoleMatches() {
        return roleMatches;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }
}