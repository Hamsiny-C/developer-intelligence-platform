package com.hamsiny.developerintelligenceplatform.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hamsiny.developerintelligenceplatform.dto.ResumeUploadResponse;
import com.hamsiny.developerintelligenceplatform.dto.RoleMatchResponse;
import com.hamsiny.developerintelligenceplatform.entity.ResumeAnalysisHistory;
import com.hamsiny.developerintelligenceplatform.repository.ResumeAnalysisHistoryRepository;

@Service
public class ResumeUploadAnalyzerService {

    private final ResumeAnalysisHistoryRepository historyRepository;

    public ResumeUploadAnalyzerService(
            ResumeAnalysisHistoryRepository historyRepository) {

        this.historyRepository = historyRepository;
    }
    public ResumeUploadResponse analyzeResumePdf(MultipartFile file) {

        try {
            String resumeText = extractTextFromPdf(file).toLowerCase();

            Map<String, List<String>> roleSkills = getRoleSkills();

            List<RoleMatchResponse> roleMatches = new ArrayList<>();

            Set<String> allMatchedSkills = new HashSet<>();
            Set<String> allMissingSkills = new HashSet<>();

            for (Map.Entry<String, List<String>> entry : roleSkills.entrySet()) {

                String role = entry.getKey();
                List<String> skills = entry.getValue();

                int matchedCount = 0;

                for (String skill : skills) {
                    if (resumeText.contains(skill.toLowerCase())) {
                        matchedCount++;
                        allMatchedSkills.add(skill);
                    } else {
                        allMissingSkills.add(skill);
                    }
                }

                int roleScore = (matchedCount * 100) / skills.size();
                roleMatches.add(new RoleMatchResponse(role, roleScore));
            }

            roleMatches.sort((a, b) -> b.getScore() - a.getScore());

            RoleMatchResponse bestMatch = roleMatches.get(0);

            int formattingScore = calculateFormattingScore(resumeText);
            int overallAtsScore = (bestMatch.getScore() * 80 + formattingScore * 20) / 100;

            String matchLevel = getMatchLevel(overallAtsScore);

            List<String> suggestions = generateSuggestions(overallAtsScore, allMissingSkills);
historyRepository.save(
        new ResumeAnalysisHistory(
                file.getOriginalFilename(),
                overallAtsScore,
                bestMatch.getRole(),
                matchLevel
        )
);
            return new ResumeUploadResponse(
                    overallAtsScore,
                    bestMatch.getRole(),
                    matchLevel,
                    roleMatches.subList(0, Math.min(5, roleMatches.size())),
                    new ArrayList<>(allMatchedSkills),
                    new ArrayList<>(allMissingSkills),
                    suggestions
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze resume PDF: " + e.getMessage());
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws Exception {

        byte[] fileBytes = file.getBytes();

        try (PDDocument document = Loader.loadPDF(fileBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private Map<String, List<String>> getRoleSkills() {

        Map<String, List<String>> roles = new LinkedHashMap<>();

        roles.put("Backend Developer", Arrays.asList(
                "Java", "Spring Boot", "MySQL", "REST API", "Git", "GitHub", "JWT", "Docker"
        ));

        roles.put("Frontend Developer", Arrays.asList(
                "HTML", "CSS", "JavaScript", "React", "Responsive Design", "Git", "GitHub"
        ));

        roles.put("Full Stack Developer", Arrays.asList(
                "Java", "Spring Boot", "MySQL", "HTML", "CSS", "JavaScript", "REST API", "GitHub"
        ));

        roles.put("Software Engineer", Arrays.asList(
                "Java", "Python", "Data Structures", "Algorithms", "OOP", "GitHub", "SQL"
        ));

        roles.put("Data Analyst", Arrays.asList(
                "Python", "SQL", "Excel", "Power BI", "Data Visualization", "Statistics"
        ));

        roles.put("Data Scientist", Arrays.asList(
                "Python", "Machine Learning", "Pandas", "NumPy", "SQL", "Statistics"
        ));

        roles.put("Machine Learning Engineer", Arrays.asList(
                "Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn"
        ));

        roles.put("AI Engineer", Arrays.asList(
                "Python", "Artificial Intelligence", "Machine Learning", "NLP", "Deep Learning", "LLM"
        ));

        roles.put("DevOps Engineer", Arrays.asList(
                "Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git"
        ));

        roles.put("Cloud Engineer", Arrays.asList(
                "AWS", "Azure", "Google Cloud", "Linux", "Docker", "Kubernetes"
        ));

        roles.put("Cyber Security Analyst", Arrays.asList(
                "Network Security", "Linux", "Cyber Security", "Vulnerability", "Firewall", "Risk Analysis"
        ));

        roles.put("Android Developer", Arrays.asList(
                "Java", "Kotlin", "Android Studio", "Firebase", "REST API", "GitHub"
        ));

        roles.put("UI UX Designer", Arrays.asList(
                "Figma", "Wireframing", "Prototyping", "User Research", "UI Design", "UX Design"
        ));

        roles.put("QA Engineer", Arrays.asList(
                "Manual Testing", "Automation Testing", "Selenium", "Test Cases", "Bug Tracking", "Java"
        ));

        return roles;
    }

    private int calculateFormattingScore(String resumeText) {

        int score = 0;

        if (resumeText.contains("email") || resumeText.contains("@")) {
            score += 20;
        }

        if (resumeText.contains("github")) {
            score += 20;
        }

        if (resumeText.contains("linkedin")) {
            score += 20;
        }

        if (resumeText.contains("education")) {
            score += 20;
        }

        if (resumeText.contains("project") || resumeText.contains("projects")) {
            score += 20;
        }

        return score;
    }

    private String getMatchLevel(int score) {

        if (score >= 85) {
            return "Excellent Match";
        } else if (score >= 70) {
            return "Strong Match";
        } else if (score >= 50) {
            return "Moderate Match";
        } else {
            return "Needs Improvement";
        }
    }

    private List<String> generateSuggestions(int score, Set<String> missingSkills) {

        List<String> suggestions = new ArrayList<>();

        if (score < 70) {
            suggestions.add("Add more role-specific technical skills to improve ATS compatibility.");
        }

        if (missingSkills.contains("GitHub")) {
            suggestions.add("Add your GitHub profile link to improve technical credibility.");
        }

        if (missingSkills.contains("REST API")) {
            suggestions.add("Mention REST API experience clearly in your project description.");
        }

        if (missingSkills.contains("Docker")) {
            suggestions.add("Learning Docker can improve backend and DevOps role matching.");
        }

        suggestions.add("Use clear headings like Education, Skills, Projects, Experience, and Certifications.");
        suggestions.add("Add measurable project impact, tools used, and live/deployed links if available.");

        return suggestions;
    }
}