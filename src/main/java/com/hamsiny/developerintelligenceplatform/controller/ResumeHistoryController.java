package com.hamsiny.developerintelligenceplatform.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.entity.ResumeAnalysisHistory;
import com.hamsiny.developerintelligenceplatform.repository.ResumeAnalysisHistoryRepository;

@RestController
@RequestMapping("/resume-history")
public class ResumeHistoryController {

    private final ResumeAnalysisHistoryRepository repository;

    public ResumeHistoryController(ResumeAnalysisHistoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ResumeAnalysisHistory> getHistory() {
        return repository.findAll();
    }
}