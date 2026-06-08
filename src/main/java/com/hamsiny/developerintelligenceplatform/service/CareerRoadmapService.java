package com.hamsiny.developerintelligenceplatform.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;

@Service
public class CareerRoadmapService {

    public List<String> generateRoadmap(List<LanguageStatsDTO> languages) {

        List<String> roadmap = new ArrayList<>();

        boolean hasJava = false;
        boolean hasPython = false;
        boolean hasJavaScript = false;

        for (LanguageStatsDTO languageStats : languages) {
            String language = languageStats.getLanguage();

            if ("Java".equalsIgnoreCase(language)) {
                hasJava = true;
            }

            if ("Python".equalsIgnoreCase(language)) {
                hasPython = true;
            }

            if ("JavaScript".equalsIgnoreCase(language) || "TypeScript".equalsIgnoreCase(language)) {
                hasJavaScript = true;
            }
        }

        if (hasJava) {
            roadmap.add("Learn Spring Security and JWT Authentication");
            roadmap.add("Learn Microservices Architecture");
            roadmap.add("Learn Redis Caching");
            roadmap.add("Learn Docker for Deployment");
        }

        if (hasPython) {
            roadmap.add("Learn Machine Learning Basics");
            roadmap.add("Build AI-powered backend features");
        }

        if (hasJavaScript) {
            roadmap.add("Learn React.js for frontend dashboards");
            roadmap.add("Learn Chart.js for analytics visualization");
        }

        roadmap.add("Deploy project using Render or Railway");
        roadmap.add("Add Swagger API Documentation");

        return roadmap;
    }
}