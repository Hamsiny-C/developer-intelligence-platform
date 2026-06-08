package com.hamsiny.developerintelligenceplatform.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.hamsiny.developerintelligenceplatform.dto.GitHubProfileDTO;
import com.hamsiny.developerintelligenceplatform.service.GitHubService;

@RestController
public class GitHubProfileController {

    private final GitHubService gitHubService;

    public GitHubProfileController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping("/profile/{username}")
    public GitHubProfileDTO getProfile(
            @PathVariable String username
    ) {
        return gitHubService.getUserProfile(username);
    }
}