package com.hamsiny.developerintelligenceplatform.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String name;

    private String email;

    private String githubUsername;

    private String password;
}