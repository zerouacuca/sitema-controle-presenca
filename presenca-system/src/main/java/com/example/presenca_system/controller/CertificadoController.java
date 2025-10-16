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
        String emailSuperusuario = authentication.getName();
        Optional<Certificado> certificadoOptional = certificadoService.findByIdAndSuperusuarioEmail(id, emailSuperusuario);
        
        if (certificadoOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        Certificado certificado = certificadoOptional.get();
        
        try {
            byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "certificado_" + certificado.getCpfUsuario() + ".pdf";
            headers.setContentDispositionFormData(filename, filename);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException | DocumentException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/meus-certificados")
    public List<CertificadoDTO> getMeusCertificados(Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        return certificadoService.findBySuperusuarioEmailDTO(emailSuperusuario);
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<CertificadoDTO>> getCertificadosPorEvento(@PathVariable Long eventoId, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        try {
            List<CertificadoDTO> certificados = certificadoService.findByEventoAndSuperusuarioEmailDTO(eventoId, emailSuperusuario);
            return ResponseEntity.ok(certificados);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/enviar-email")
    public ResponseEntity<String> enviarCertificadosPorEmail(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String emailSuperusuario = authentication.getName();
            @SuppressWarnings("unchecked")
            List<Long> certificadoIds = (List<Long>) request.get("certificadoIds");
            String emailDestinatario = (String) request.get("email");
            
            if (certificadoIds == null || certificadoIds.isEmpty() || emailDestinatario == null) {
                return ResponseEntity.badRequest().body("Dados inválidos");
            }

            boolean permissoesValidas = certificadoService.verificarPermissoesCertificados(certificadoIds, emailSuperusuario);
            if (!permissoesValidas) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado a um ou mais certificados");
            }

            emailService.enviarCertificadosPorEmail(certificadoIds, emailDestinatario);
            return ResponseEntity.ok("Certificados enviados com sucesso para: " + emailDestinatario);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro: " + e.getMessage());
        }
    }

    //  métodos públicos (sem autenticação) para acesso externo
    @GetMapping("/public/por-cpf/evento/{eventoId}/usuario/{cpf}")
    public ResponseEntity<byte[]> getCertificadoPDFPorCpf(
        @PathVariable String cpf,
        @PathVariable Long eventoId) {

        Optional<Certificado> certificadoOptional = certificadoService.findByUsuarioCpfAndEventoEventoId(cpf, eventoId);
        
        if (certificadoOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        Certificado certificado = certificadoOptional.get();
        
        try {
            byte[] pdfBytes = certificadoService.gerarCertificadoPDF(certificado);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "certificado_" + cpf + ".pdf";
            headers.setContentDispositionFormData(filename, filename);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException | DocumentException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}