package com.hamsiny.developerintelligenceplatform.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hamsiny.developerintelligenceplatform.dto.GitHubProfileDTO;
import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;

@Service
public class GitHubService {

    private final RestTemplate restTemplate = new RestTemplate();

    public GitHubRepoDTO[] getUserRepositories(String username) {

        String url =
                "https://api.github.com/users/" +
                username +
                "/repos";

        return restTemplate.getForObject(
                url,
                GitHubRepoDTO[].class
        );
    }

    public GitHubProfileDTO getUserProfile(String username) {

        String url =
                "https://api.github.com/users/" +
                username;

        return restTemplate.getForObject(
                url,
                GitHubProfileDTO.class
        );
    }
}