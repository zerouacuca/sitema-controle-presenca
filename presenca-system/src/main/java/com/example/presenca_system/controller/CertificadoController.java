package com.example.presenca_system.controller;

import com.example.presenca_system.service.CertificadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class CertificadoController {

    @Autowired
    private CertificadoService certificadoService;

    @GetMapping("/certificado")
    public ResponseEntity<byte[]> gerarCertificado(
            @RequestParam("nomeParticipante") String nomeParticipante,
            @RequestParam("nomeEvento") String nomeEvento) {

        try {
            Map<String, String> dados = new HashMap<>();
            dados.put("nomeParticipante", nomeParticipante);
            dados.put("nomeEvento", nomeEvento);
            dados.put("dataEvento", "10 de Setembro de 2025");

            byte[] pdfBytes = certificadoService.gerarCertificadoPDF(dados);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "certificado.pdf");
            headers.setContentLength(pdfBytes.length);

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}