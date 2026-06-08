package com.hamsiny.developerintelligenceplatform.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.ResumeAnalysisRequest;
import com.hamsiny.developerintelligenceplatform.dto.ResumeAnalysisResponse;
import com.hamsiny.developerintelligenceplatform.service.ResumeAnalyzerService;

@RestController
@RequestMapping("/resume")
public class ResumeAnalyzerController {

    private final ResumeAnalyzerService resumeAnalyzerService;

    public ResumeAnalyzerController(ResumeAnalyzerService resumeAnalyzerService) {
        this.resumeAnalyzerService = resumeAnalyzerService;
    }

    @PostMapping("/analyze")
    public ResumeAnalysisResponse analyzeResume(@RequestBody ResumeAnalysisRequest request) {
        return resumeAnalyzerService.analyzeResume(request);
    }
}