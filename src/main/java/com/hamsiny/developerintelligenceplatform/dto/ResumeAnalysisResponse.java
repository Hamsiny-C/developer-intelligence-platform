package com.hamsiny.developerintelligenceplatform.dto;

import java.util.List;

public class ResumeAnalysisResponse {

    private int atsScore;
    private String targetRole;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> suggestions;

    public ResumeAnalysisResponse(int atsScore,
                                  String targetRole,
                                  List<String> matchedSkills,
                                  List<String> missingSkills,
                                  List<String> suggestions) {
        this.atsScore = atsScore;
        this.targetRole = targetRole;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.suggestions = suggestions;
    }

    public int getAtsScore() {
        return atsScore;
    }

    public void setAtsScore(int atsScore) {
        this.atsScore = atsScore;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}