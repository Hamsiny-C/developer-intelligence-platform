package com.hamsiny.developerintelligenceplatform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;

@RestController
public class GitHubController {

    private final GitHubService gitHubService;

    public GitHubController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping("/github/{username}")
    public GitHubRepoDTO[] getRepositories(@PathVariable String username) {
        return gitHubService.getUserRepositories(username);
    }
}