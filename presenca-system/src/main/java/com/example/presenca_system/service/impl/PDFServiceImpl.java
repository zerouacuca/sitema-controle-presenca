package com.example.presenca_system.service.impl;

import com.example.presenca_system.service.PDFService;
import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.repository.CertificadoRepository;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.List;

@Service
public class PDFServiceImpl implements PDFService {

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private CertificadoRepository certificadoRepository;
    
    private byte[] readAllBytesFromStream(InputStream inputStream) throws IOException {
        final int BUFFER_SIZE = 4096;
        byte[] buffer = new byte[BUFFER_SIZE];
        int bytesRead;
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }
        return outputStream.toByteArray();
    }

    private String getImageBase64() throws IOException {
        ClassPathResource imgFile = new ClassPathResource("static/images/plano_de_fundo_certificado.png");
        
        try (InputStream inputStream = imgFile.getInputStream()) {
            if (inputStream == null) {
                throw new IOException("Resource not found: static/images/plano_de_fundo_certificado.png");
            }
            byte[] imageBytes = readAllBytesFromStream(inputStream);
            return Base64.getEncoder().encodeToString(imageBytes);
        }
    }

    @Override
    public byte[] gerarCertificadoPDF(Certificado certificado) throws IOException, DocumentException {
        Context context = new Context();
        context.setVariable("certificado", certificado);

        String imageBase64 = getImageBase64();
        context.setVariable("backgroundImageBase64", imageBase64);

        String htmlContent = templateEngine.process("certificado-template", context);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        }
    }

    @Override
    public byte[] gerarPDFConsolidado(Long eventoId) throws IOException, DocumentException {
        List<Certificado> certificados = certificadoRepository.findByEventoEventoId(eventoId);
        
        if (certificados.isEmpty()) {
            return new byte[0];
        }
        
        String imageBase64 = getImageBase64();

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            
            for (int i = 0; i < certificados.size(); i++) {
                Certificado certificado = certificados.get(i);
                Context context = new Context();
                context.setVariable("certificado", certificado);
                
                context.setVariable("backgroundImageBase64", imageBase64);
                
                String htmlContent = templateEngine.process("certificado-template", context);
                
                renderer.setDocumentFromString(htmlContent);
                renderer.layout();
                
                if (i == 0) {
                    renderer.createPDF(outputStream, false);
                } else {
                    renderer.writeNextDocument();
                }
            }
            
            renderer.finishPDF();
            return outputStream.toByteArray();
        }
    }
}