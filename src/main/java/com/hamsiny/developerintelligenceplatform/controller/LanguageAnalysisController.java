package com.hamsiny.developerintelligenceplatform.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;
import com.hamsiny.developerintelligenceplatform.service.LanguageAnalysisService;

@RestController
public class LanguageAnalysisController {

    private final GitHubService gitHubService;
    private final LanguageAnalysisService languageAnalysisService;

    public LanguageAnalysisController(GitHubService gitHubService,
                        LanguageAnalysisService languageAnalysisService) {
        this.gitHubService = gitHubService;
        this.languageAnalysisService = languageAnalysisService;
    }

    @GetMapping("/languages/{username}")
    public List<LanguageStatsDTO> getLanguages(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);
        return languageAnalysisService.analyzeLanguages(repos);
    }
}