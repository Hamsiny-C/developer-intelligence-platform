package com.hamsiny.developerintelligenceplatform.dto;

import lombok.Data;

@Data
public class ResumeAnalysisRequest {

    private String resumeText;

    private String targetRole;
}