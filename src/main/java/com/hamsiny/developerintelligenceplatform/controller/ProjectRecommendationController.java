package com.hamsiny.developerintelligenceplatform.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;
import com.hamsiny.developerintelligenceplatform.service.LanguageAnalysisService;
import com.hamsiny.developerintelligenceplatform.service.ProjectRecommendationService;

@RestController
public class ProjectRecommendationController {

    private final GitHubService gitHubService;
    private final LanguageAnalysisService languageAnalysisService;
    private final ProjectRecommendationService projectRecommendationService;

    public ProjectRecommendationController(GitHubService gitHubService,
                                           LanguageAnalysisService languageAnalysisService,
                                           ProjectRecommendationService projectRecommendationService) {
        this.gitHubService = gitHubService;
        this.languageAnalysisService = languageAnalysisService;
        this.projectRecommendationService = projectRecommendationService;
    }

    @GetMapping("/recommendations/{username}")
    public List<String> getRecommendations(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);
        List<LanguageStatsDTO> languages = languageAnalysisService.analyzeLanguages(repos);
        return projectRecommendationService.recommendProjects(languages);
    }
}