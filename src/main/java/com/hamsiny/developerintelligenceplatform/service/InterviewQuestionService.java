package com.hamsiny.developerintelligenceplatform.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;

@Service
public class InterviewQuestionService {

    public List<String> generateQuestions(List<LanguageStatsDTO> languages) {

        List<String> questions = new ArrayList<>();

        for (LanguageStatsDTO languageStats : languages) {

            String language = languageStats.getLanguage();

            if ("Java".equalsIgnoreCase(language)) {
                questions.add("What is the difference between JDK, JRE, and JVM?");
                questions.add("Explain Object-Oriented Programming concepts in Java.");
                questions.add("What is Spring Boot and why is it used?");
                questions.add("What is the use of JPA Repository?");
            }

            if ("Python".equalsIgnoreCase(language)) {
                questions.add("What are lists, tuples, and dictionaries in Python?");
                questions.add("How is Python used in data analytics?");
            }

            if ("JavaScript".equalsIgnoreCase(language) || "TypeScript".equalsIgnoreCase(language)) {
                questions.add("What is the difference between JavaScript and TypeScript?");
                questions.add("Explain how frontend communicates with backend APIs.");
            }

            if ("CSS".equalsIgnoreCase(language)) {
                questions.add("What is responsive design?");
                questions.add("What is the difference between flexbox and grid?");
            }
        }

        questions.add("Explain one project from your GitHub profile.");
        questions.add("What challenges did you face while building your project?");
        questions.add("How did you connect your backend with external APIs?");

        return questions;
    }
}