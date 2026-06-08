package com.hamsiny.developerintelligenceplatform.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hamsiny.developerintelligenceplatform.dto.GitHubRepoDTO;
import com.hamsiny.developerintelligenceplatform.dto.LanguageStatsDTO;

@Service
public class LanguageAnalysisService {

    public List<LanguageStatsDTO> analyzeLanguages(
            GitHubRepoDTO[] repos
    ) {

        Map<String, Integer> languageCount =
                new HashMap<>();

        for (GitHubRepoDTO repo : repos) {

            String language = repo.getLanguage();

            if (language != null) {

                languageCount.put(
                        language,
                        languageCount.getOrDefault(
                                language,
                                0
                        ) + 1
                );
            }
        }

        List<LanguageStatsDTO> result =
                new ArrayList<>();

        for (Map.Entry<String, Integer> entry :
                languageCount.entrySet()) {

            result.add(
                    new LanguageStatsDTO(
                            entry.getKey(),
                            entry.getValue()
                    )
            );
        }

        return result;
    }
}