package com.example.presenca_system.service;

import com.lowagie.text.DocumentException;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CertificadoService {

    public byte[] gerarCertificadoPDF(Map<String, String> dados) throws IOException, DocumentException {
        String htmlTemplate = lerTemplateHTML("certificado.html");
        String htmlPreenchido = preencherTemplate(htmlTemplate, dados);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlPreenchido);
            renderer.layout();
            renderer.createPDF(os);
            return os.toByteArray();
        }
    }

    private String lerTemplateHTML(String nomeArquivo) throws IOException {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("templates/" + nomeArquivo)) {
            if (inputStream == null) {
                throw new FileNotFoundException("Template não encontrado: " + nomeArquivo);
            }
            try (Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8)) {
                return new BufferedReader(reader)
                        .lines()
                        .collect(Collectors.joining("\n"));
            }
        }
    }

    private String preencherTemplate(String template, Map<String, String> dados) {
        String html = template;
        for (Map.Entry<String, String> entry : dados.entrySet()) {
            html = html.replace("${" + entry.getKey() + "}", entry.getValue());
        }
        return html;
    }
}