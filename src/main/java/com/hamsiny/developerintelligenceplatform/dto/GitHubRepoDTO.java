package com.hamsiny.developerintelligenceplatform.dto;

import lombok.Data;

@Data
public class GitHubRepoDTO {

    private String name;
    private String description;
    private String language;
    private int stargazers_count;
    private int forks_count;
}