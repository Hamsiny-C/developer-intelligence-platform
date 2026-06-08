package com.hamsiny.developerintelligenceplatform.dto;

import java.util.List;

import lombok.Data;

@Data
public class DeveloperReportDTO {

    private String username;
    private int developerScore;
    private int totalRepositories;

    private List<LanguageStatsDTO> topLanguages;
    private List<String> recommendations;
}