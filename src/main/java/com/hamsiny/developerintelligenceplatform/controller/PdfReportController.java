package com.hamsiny.developerintelligenceplatform.controller;

import com.hamsiny.developerintelligenceplatform.dto.ResumeUploadResponse;
import com.hamsiny.developerintelligenceplatform.service.PdfReportService;
import com.hamsiny.developerintelligenceplatform.service.ResumeUploadAnalyzerService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/resume-report")
public class PdfReportController {

    private final ResumeUploadAnalyzerService analyzerService;
    private final PdfReportService pdfReportService;

    public PdfReportController(ResumeUploadAnalyzerService analyzerService,
                               PdfReportService pdfReportService) {
        this.analyzerService = analyzerService;
        this.pdfReportService = pdfReportService;
    }

    @PostMapping(
            value = "/download",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<byte[]> downloadReport(@RequestParam("file") MultipartFile file) {

        ResumeUploadResponse response = analyzerService.analyzeResumePdf(file);

        byte[] pdfBytes = pdfReportService.generateReport(response);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=DevIntel_ATS_Report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}