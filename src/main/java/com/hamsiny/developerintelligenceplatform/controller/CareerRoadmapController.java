package com.hamsiny.developerintelligenceplatform.controller;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;
import com.hamsiny.developerintelligenceplatform.service.CareerRoadmapService;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;
import com.hamsiny.developerintelligenceplatform.service.LanguageAnalysisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CareerRoadmapController {

    private final GitHubService gitHubService;
    private final LanguageAnalysisService languageAnalysisService;
    private final CareerRoadmapService careerRoadmapService;

    public CareerRoadmapController(GitHubService gitHubService,
                                   LanguageAnalysisService languageAnalysisService,
                                   CareerRoadmapService careerRoadmapService) {
        this.gitHubService = gitHubService;
        this.languageAnalysisService = languageAnalysisService;
        this.careerRoadmapService = careerRoadmapService;
    }

    @GetMapping("/roadmap/{username}")
    public List<String> getRoadmap(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);
        List<LanguageStatsDTO> languages = languageAnalysisService.analyzeLanguages(repos);
        return careerRoadmapService.generateRoadmap(languages);
    }
}