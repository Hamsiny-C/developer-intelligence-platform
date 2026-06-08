package com.hamsiny.developerintelligenceplatform.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ResumeAnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private int atsScore;
    private String bestRole;
    private String matchLevel;
    private LocalDateTime analyzedAt;

    public ResumeAnalysisHistory() {
    }

    public ResumeAnalysisHistory(String fileName, int atsScore, String bestRole, String matchLevel) {
        this.fileName = fileName;
        this.atsScore = atsScore;
        this.bestRole = bestRole;
        this.matchLevel = matchLevel;
        this.analyzedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFileName() {
        return fileName;
    }

    public int getAtsScore() {
        return atsScore;
    }

    public String getBestRole() {
        return bestRole;
    }

    public String getMatchLevel() {
        return matchLevel;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }
}