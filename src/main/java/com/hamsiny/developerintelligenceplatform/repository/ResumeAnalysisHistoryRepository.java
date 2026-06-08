package com.hamsiny.developerintelligenceplatform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hamsiny.developerintelligenceplatform.entity.ResumeAnalysisHistory;

public interface ResumeAnalysisHistoryRepository
        extends JpaRepository<ResumeAnalysisHistory, Long> {
}