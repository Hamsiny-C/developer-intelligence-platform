package com.hamsiny.developerintelligenceplatform.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;

@Service
public class ProjectRecommendationService {

    public List<String> recommendProjects(List<LanguageStatsDTO> languages) {

        List<String> recommendations = new ArrayList<>();

        for (LanguageStatsDTO languageStats : languages) {

            String language = languageStats.getLanguage();

            if ("Java".equalsIgnoreCase(language)) {
                recommendations.add("Build a Spring Boot Microservices Project");
                recommendations.add("Build a REST API with JWT Authentication");
            }

            if ("Python".equalsIgnoreCase(language)) {
                recommendations.add("Build an AI Resume Analyzer");
                recommendations.add("Build a Data Analytics Dashboard");
            }

            if ("JavaScript".equalsIgnoreCase(language)) {
                recommendations.add("Build a Full Stack MERN Application");
            }

            if ("TypeScript".equalsIgnoreCase(language)) {
                recommendations.add("Build a TypeScript-Based Developer Dashboard");
            }

            if ("CSS".equalsIgnoreCase(language)) {
                recommendations.add("Improve UI by building a Responsive Portfolio Website");
            }
        }

        if (recommendations.isEmpty()) {
            recommendations.add("Start with a Java Spring Boot CRUD Project");
        }

        return recommendations;
    }
}