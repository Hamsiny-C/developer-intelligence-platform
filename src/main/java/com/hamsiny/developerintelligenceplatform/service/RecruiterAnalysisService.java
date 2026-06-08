package com.hamsiny.developerintelligenceplatform.service;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.RecruiterViewDTO;

@Service
public class RecruiterAnalysisService {

    public RecruiterViewDTO analyzeCandidate(
            int developerScore,
            int totalRepositories
    ) {

        RecruiterViewDTO dto =
                new RecruiterViewDTO();

        int hireScore =
                Math.min(
                        developerScore +
                        (totalRepositories * 2),
                        100
                );

        dto.setHireScore(hireScore);

        if (hireScore >= 85) {
            dto.setExperienceLevel("Advanced");
            dto.setRiskLevel("Low");
        }
        else if (hireScore >= 60) {
            dto.setExperienceLevel("Intermediate");
            dto.setRiskLevel("Medium");
        }
        else {
            dto.setExperienceLevel("Beginner");
            dto.setRiskLevel("High");
        }

        if (developerScore >= 80) {
            dto.setRecommendedRole(
                    "Backend Developer"
            );
        }
        else {
            dto.setRecommendedRole(
                    "Junior Software Developer"
            );
        }

        return dto;
    }
}