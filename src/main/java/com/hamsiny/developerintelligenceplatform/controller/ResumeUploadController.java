package com.hamsiny.developerintelligenceplatform.controller;

import com.hamsiny.developerintelligenceplatform.dto.ResumeUploadResponse;
import com.hamsiny.developerintelligenceplatform.service.ResumeUploadAnalyzerService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume-upload")
public class ResumeUploadController {

    private final ResumeUploadAnalyzerService service;

    public ResumeUploadController(ResumeUploadAnalyzerService service) {
        this.service = service;
    }

    @PostMapping(
            value = "/analyze",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResumeUploadResponse analyzeResume(
            @RequestParam("file") MultipartFile file) {

        return service.analyzeResumePdf(file);
    }
}