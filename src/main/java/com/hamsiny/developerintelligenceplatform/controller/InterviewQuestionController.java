package com.hamsiny.developerintelligenceplatform.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;
import com.hamsiny.developerintelligenceplatform.service.InterviewQuestionService;
import com.hamsiny.developerintelligenceplatform.service.LanguageAnalysisService;

@RestController
public class InterviewQuestionController {

    private final GitHubService gitHubService;
    private final LanguageAnalysisService languageAnalysisService;
    private final InterviewQuestionService interviewQuestionService;

    public InterviewQuestionController(GitHubService gitHubService,
                                       LanguageAnalysisService languageAnalysisService,
                                       InterviewQuestionService interviewQuestionService) {
        this.gitHubService = gitHubService;
        this.languageAnalysisService = languageAnalysisService;
        this.interviewQuestionService = interviewQuestionService;
    }

    @GetMapping("/interview-questions/{username}")
    public List<String> getInterviewQuestions(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);
        List<LanguageStatsDTO> languages = languageAnalysisService.analyzeLanguages(repos);
        return interviewQuestionService.generateQuestions(languages);
    }
}