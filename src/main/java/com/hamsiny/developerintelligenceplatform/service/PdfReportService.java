package com.hamsiny.developerintelligenceplatform.service;

import com.hamsiny.developerintelligenceplatform.dto.ResumeUploadResponse;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfReportService {

    public byte[] generateReport(ResumeUploadResponse response) {

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            Document document = new Document();
            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12);

            document.add(new Paragraph("DevIntel ATS Report", titleFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("ATS Score: " + response.getOverallAtsScore(), normalFont));
            document.add(new Paragraph("Best Suitable Role: " + response.getBestRole(), normalFont));
            document.add(new Paragraph("Match Level: " + response.getMatchLevel(), normalFont));

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Matched Skills", titleFont));

            for (String skill : response.getMatchedSkills()) {
                document.add(new Paragraph("• " + skill));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Missing Skills", titleFont));

            for (String skill : response.getMissingSkills()) {
                document.add(new Paragraph("• " + skill));
            }

            document.add(new Paragraph(" "));
            document.add(new Paragraph("Suggestions", titleFont));

            for (String suggestion : response.getSuggestions()) {
                document.add(new Paragraph("• " + suggestion));
            }

            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report");
        }
    }
}