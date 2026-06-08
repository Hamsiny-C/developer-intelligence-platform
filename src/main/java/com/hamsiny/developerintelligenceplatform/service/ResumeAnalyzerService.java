package com.hamsiny.developerintelligenceplatform.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.ResumeAnalysisRequest;
import com.hamsiny.developerintelligenceplatform.dto.ResumeAnalysisResponse;

@Service
public class ResumeAnalyzerService {

    public ResumeAnalysisResponse analyzeResume(ResumeAnalysisRequest request) {

        String resumeText = request.getResumeText().toLowerCase();
        String targetRole = request.getTargetRole();

        List<String> requiredSkills = getRequiredSkills(targetRole);
        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();

        for (String skill : requiredSkills) {
            if (resumeText.contains(skill.toLowerCase())) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        int atsScore = (matchedSkills.size() * 100) / requiredSkills.size();

        for (String skill : missingSkills) {
            suggestions.add("Add or improve " + skill + " skills in your resume.");
        }

        if (atsScore >= 80) {
            suggestions.add("Your resume is strong for this role.");
        } else if (atsScore >= 50) {
            suggestions.add("Your resume is good, but needs more role-specific skills.");
        } else {
            suggestions.add("Your resume needs major improvement for this role.");
        }

        return new ResumeAnalysisResponse(
                atsScore,
                targetRole,
                matchedSkills,
                missingSkills,
                suggestions
        );
    }
private List<String> getRequiredSkills(String targetRole) {

    List<String> skills = new ArrayList<>();

    if (targetRole == null) {
        targetRole = "";
    }

    switch (targetRole.toLowerCase()) {

        case "backend developer":
            skills.add("Java");
            skills.add("Spring Boot");
            skills.add("MySQL");
            skills.add("REST API");
            skills.add("Git");
            skills.add("GitHub");
            break;

        case "frontend developer":
            skills.add("HTML");
            skills.add("CSS");
            skills.add("JavaScript");
            skills.add("Responsive Design");
            skills.add("Git");
            skills.add("GitHub");
            break;

        case "full stack developer":
            skills.add("Java");
            skills.add("Spring Boot");
            skills.add("MySQL");
            skills.add("HTML");
            skills.add("CSS");
            skills.add("JavaScript");
            skills.add("REST API");
            skills.add("GitHub");
            break;

        case "data analyst":
            skills.add("Python");
            skills.add("SQL");
            skills.add("Excel");
            skills.add("Power BI");
            skills.add("Data Visualization");
            skills.add("Statistics");
            break;

        case "data scientist":
            skills.add("Python");
            skills.add("Machine Learning");
            skills.add("Pandas");
            skills.add("NumPy");
            skills.add("SQL");
            skills.add("Statistics");
            break;

        case "android developer":
            skills.add("Java");
            skills.add("Kotlin");
            skills.add("Android Studio");
            skills.add("Firebase");
            skills.add("REST API");
            skills.add("GitHub");
            break;

        case "devops engineer":
            skills.add("Linux");
            skills.add("Docker");
            skills.add("Kubernetes");
            skills.add("AWS");
            skills.add("CI/CD");
            skills.add("Git");
            break;

        case "ui ux designer":
            skills.add("Figma");
            skills.add("Wireframing");
            skills.add("Prototyping");
            skills.add("User Research");
            skills.add("UI Design");
            skills.add("UX Design");
            break;

        case "software engineer":
            skills.add("Java");
            skills.add("Python");
            skills.add("Data Structures");
            skills.add("Algorithms");
            skills.add("OOP");
            skills.add("GitHub");
            break;

        default:
            skills.add("Java");
            skills.add("Python");
            skills.add("SQL");
            skills.add("GitHub");
            skills.add("Problem Solving");
            skills.add("Communication");
    }

    return skills;
}
}