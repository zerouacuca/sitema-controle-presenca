// src/main/java/com/example/presenca_system/controller/CertificadoController.java
package com.example.presenca_system.controller;

import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.service.CertificadoService;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/certificados")
public class CertificadoController {

    @Autowired
    private CertificadoService certificadoService;

    @Autowired
    private CertificadoRepository certificadoRepository;

    // Código corrigido para evitar o erro de tipo
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getCertificadoPDF(@PathVariable Long id) {
        // 1. Busca o certificado no banco de dados pelo ID
        return certificadoRepository.findById(id)
                .map(certificado -> {
                    try {
                        // 2. Chama o serviço para gerar o PDF a partir do objeto Certificado
                        byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);

                        // 3. Configura a resposta HTTP para um arquivo PDF
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        String filename = "certificado_" + certificado.getUsuario().getCpf() + ".pdf";
                        headers.setContentDispositionFormData(filename, filename);
                        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

                        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

                    } catch (IOException | DocumentException e) {
                        e.printStackTrace();
                        return new ResponseEntity<byte[]>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                })
                // O retorno de orElseGet() foi ajustado para corresponder ao tipo esperado
                .orElseGet(() -> new ResponseEntity<byte[]>(HttpStatus.NOT_FOUND)); 
}
}