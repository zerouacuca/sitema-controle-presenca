package com.example.presenca_system.controller;

import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.dto.CertificadoDTO;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.service.EmailService;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/certificados")
public class CertificadoController {

    @Autowired
    private CertificadoService certificadoService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getCertificadoPDF(@PathVariable Long id, Authentication authentication) {
        Optional<Certificado> certificadoOptional = certificadoService.findById(id);

        if (certificadoOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Certificado certificado = certificadoOptional.get();

        try {
            byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "certificado_" + certificado.getMatriculaUsuario() + ".pdf"; // Changed getCpfUsuario to getMatriculaUsuario
            headers.setContentDispositionFormData(filename, filename);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException | DocumentException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/meus-certificados")
    public List<CertificadoDTO> getMeusCertificados(Authentication authentication) {
        return certificadoService.findAllDTO();
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<CertificadoDTO>> getCertificadosPorEvento(@PathVariable Long eventoId, Authentication authentication) {
        try {
            List<CertificadoDTO> certificados = certificadoService.findByEventoEventoIdDTO(eventoId);
            return ResponseEntity.ok(certificados);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/public/por-matricula/evento/{eventoId}/usuario/{matricula}")
    public ResponseEntity<byte[]> getCertificadoPDFPorMatricula(
        @PathVariable String matricula,
        @PathVariable Long eventoId) {

        Optional<Certificado> certificadoOptional = certificadoService.findByUsuarioMatriculaAndEventoEventoId(matricula, eventoId);

        if (certificadoOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Certificado certificado = certificadoOptional.get();

        try {
            byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "certificado_" + matricula + ".pdf";
            headers.setContentDispositionFormData(filename, filename);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException | DocumentException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}