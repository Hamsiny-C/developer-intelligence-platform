package com.hamsiny.developerintelligenceplatform.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.service.DeveloperScoreService;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;

@RestController
public class DeveloperScoreController {

    private final GitHubService gitHubService;
    private final DeveloperScoreService developerScoreService;

    public DeveloperScoreController(GitHubService gitHubService,
                                    DeveloperScoreService developerScoreService) {
        this.gitHubService = gitHubService;
        this.developerScoreService = developerScoreService;
    }

    @GetMapping("/score/{username}")
    public Map<String, Object> getDeveloperScore(@PathVariable String username) {
        GitHubRepoDTO[] repos = gitHubService.getUserRepositories(username);

        int score = developerScoreService.calculateScore(repos);

        Map<String, Object> response = new HashMap<>();
        response.put("username", username);
        response.put("developerScore", score);
        response.put("totalRepositories", repos.length);

        return response;
    }
}