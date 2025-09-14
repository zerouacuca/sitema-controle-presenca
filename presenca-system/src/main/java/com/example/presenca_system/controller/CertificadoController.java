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

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getCertificadoPDF(@PathVariable Long id) {
        return certificadoRepository.findById(id)
                .map(certificado -> {
                    try {
                        byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);

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
                .orElseGet(() -> new ResponseEntity<byte[]>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/por-cpf/evento/{eventoId}/usuario/{cpf}")
    public ResponseEntity<byte[]> getCertificadoPDFPorCpf(
        @PathVariable String cpf,
        @PathVariable Long eventoId) {

        return certificadoRepository.findByUsuarioCpfAndEventoEventoId(cpf, eventoId)
            .map(certificado -> {
                try {
                    byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_PDF);
                    String filename = "certificado_" + cpf + ".pdf";
                    headers.setContentDispositionFormData(filename, filename);
                    headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

                    return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

                } catch (IOException | DocumentException e) {
                    e.printStackTrace();
                    return new ResponseEntity<byte[]>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            })
            .orElseGet(() -> new ResponseEntity<byte[]>(HttpStatus.NOT_FOUND));
    }

    // Novo endpoint para gerar todos os certificados de um evento em um único PDF
    @GetMapping("/evento/{eventoId}/pdf-all")
    public ResponseEntity<byte[]> getCertificadosEventoPDF(@PathVariable Long eventoId) {
        try {
            byte[] pdfBytes = certificadoService.gerarPDFConsolidadoPorEvento(eventoId);

            if (pdfBytes.length == 0) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "certificados_evento_" + eventoId + ".pdf";
            headers.setContentDispositionFormData(filename, filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException | DocumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}