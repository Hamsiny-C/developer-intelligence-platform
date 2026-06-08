package com.hamsiny.developerintelligenceplatform.dto;

import lombok.Data;

@Data
public class LanguageStatsDTO {

    private String language;
    private int count;

    public LanguageStatsDTO(String language, int count) {
        this.language = language;
        this.count = count;
    }
}