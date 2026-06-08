package com.hamsiny.developerintelligenceplatform.service;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;

@Service
public class DeveloperScoreService {

    public int calculateScore(GitHubRepoDTO[] repos) {

        int score = 0;

        score += repos.length * 5;

        for (GitHubRepoDTO repo : repos) {

            score += repo.getStargazers_count() * 2;

            if (repo.getLanguage() != null) {
                score += 3;
            }
        }

        return Math.min(score, 100);
    }
}