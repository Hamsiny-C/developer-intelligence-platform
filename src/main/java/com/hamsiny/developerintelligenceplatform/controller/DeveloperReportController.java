package com.hamsiny.developerintelligenceplatform.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.DeveloperReportDTO;
import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;
import com.hamsiny.developerintelligenceplatform.service.DeveloperScoreService;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;
import com.hamsiny.developerintelligenceplatform.service.LanguageAnalysisService;
import com.hamsiny.developerintelligenceplatform.service.ProjectRecommendationService;

@RestController
public class DeveloperReportController {

    private final GitHubService gitHubService;
    private final DeveloperScoreService developerScoreService;
    private final LanguageAnalysisService languageAnalysisService;
    private final ProjectRecommendationService projectRecommendationService;

    public DeveloperReportController(GitHubService gitHubService,
                                     DeveloperScoreService developerScoreService,
                                     LanguageAnalysisService languageAnalysisService,
                                     ProjectRecommendationService projectRecommendationService) {
        this.gitHubService = gitHubService;
        this.developerScoreService = developerScoreService;
        this.languageAnalysisService = languageAnalysisService;
        this.projectRecommendationService = projectRecommendationService;
    }

    @GetMapping("/developer-report/{username}")
    public DeveloperReportDTO getDeveloperReport(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);

        int score = developerScoreService.calculateScore(repos);
        List<LanguageStatsDTO> languages = languageAnalysisService.analyzeLanguages(repos);
        List<String> recommendations = projectRecommendationService.recommendProjects(languages);

        DeveloperReportDTO report = new DeveloperReportDTO();
        report.setUsername(username);
        report.setDeveloperScore(score);
        report.setTotalRepositories(repos.length);
        report.setTopLanguages(languages);
        report.setRecommendations(recommendations);

        return report;
    }
}