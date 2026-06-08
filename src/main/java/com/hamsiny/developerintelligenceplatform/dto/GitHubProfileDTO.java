package com.hamsiny.developerintelligenceplatform.dto;

import lombok.Data;

@Data
public class GitHubProfileDTO {

    private String login;
    private String name;
    private String bio;
    private int public_repos;
    private int followers;
    private int following;
}