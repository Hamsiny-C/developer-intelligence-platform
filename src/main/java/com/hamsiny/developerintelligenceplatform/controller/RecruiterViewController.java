package com.hamsiny.developerintelligenceplatform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.RecruiterViewDTO;
import com.hamsiny.developerintelligenceplatform.service.DeveloperScoreService;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;
import com.hamsiny.developerintelligenceplatform.service.RecruiterAnalysisService;

@RestController
public class RecruiterViewController {

    private final GitHubService gitHubService;
    private final DeveloperScoreService developerScoreService;
    private final RecruiterAnalysisService recruiterAnalysisService;

    public RecruiterViewController(GitHubService gitHubService,
                                   DeveloperScoreService developerScoreService,
                                   RecruiterAnalysisService recruiterAnalysisService) {
        this.gitHubService = gitHubService;
        this.developerScoreService = developerScoreService;
        this.recruiterAnalysisService = recruiterAnalysisService;
    }

    @GetMapping("/recruiter-view/{username}")
    public RecruiterViewDTO getRecruiterView(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);

        int developerScore = developerScoreService.calculateScore(repos);
        int totalRepositories = repos.length;

        return recruiterAnalysisService.analyzeCandidate(
                developerScore,
                totalRepositories
        );
    }
}