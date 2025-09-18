package com.example.presenca_system.controller;

import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.service.EmailService;
import com.lowagie.text.DocumentException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/certificados")
public class CertificadoController {

    @Autowired
    private CertificadoService certificadoService;

    @Autowired
    private CertificadoRepository certificadoRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getCertificadoPDF(@PathVariable Long id) {
        Optional<Certificado> certificadoOptional = certificadoRepository.findById(id);
        
        if (certificadoOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        Certificado certificado = certificadoOptional.get();
        
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
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/por-cpf/evento/{eventoId}/usuario/{cpf}")
    public ResponseEntity<byte[]> getCertificadoPDFPorCpf(
        @PathVariable String cpf,
        @PathVariable Long eventoId) {

        Optional<Certificado> certificadoOptional = certificadoRepository.findByUsuarioCpfAndEventoEventoId(cpf, eventoId);
        
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
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IOException | DocumentException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    // 1) Endpoint para retornar a lista de certificados de um usuário por CPF
    @GetMapping("/usuario/{cpf}")
    public ResponseEntity<List<Certificado>> getCertificadosPorCpf(@PathVariable String cpf) {
        try {
            List<Certificado> certificados = certificadoService.buscarCertificadosPorCpf(cpf);
            
            if (certificados.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            
            return new ResponseEntity<>(certificados, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 2) Endpoint para enviar certificados por email
    @PostMapping("/enviar-email")
    public ResponseEntity<String> enviarCertificadosPorEmail(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> certificadoIds = (List<Long>) request.get("certificadoIds");
            String emailDestinatario = (String) request.get("email");
            
            if (certificadoIds == null || certificadoIds.isEmpty() || emailDestinatario == null) {
                return new ResponseEntity<>("Dados inválidos: certificadoIds e email são obrigatórios", 
                                          HttpStatus.BAD_REQUEST);
            }

            emailService.enviarCertificadosPorEmail(certificadoIds, emailDestinatario);
            
            return new ResponseEntity<>("Certificados enviados com sucesso para: " + emailDestinatario, 
                                      HttpStatus.OK);
            
        } catch (MessagingException e) {
            return new ResponseEntity<>("Erro ao enviar email: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            return new ResponseEntity<>("Erro de IO ao gerar PDFs: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (DocumentException e) {
            return new ResponseEntity<>("Erro ao gerar documentos PDF: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro inesperado: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Versão alternativa usando o método com tratamento interno
    @PostMapping("/enviar-email-simples")
    public ResponseEntity<String> enviarCertificadosPorEmailSimples(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> certificadoIds = (List<Long>) request.get("certificadoIds");
            String emailDestinatario = (String) request.get("email");
            
            if (certificadoIds == null || certificadoIds.isEmpty() || emailDestinatario == null) {
                return new ResponseEntity<>("Dados inválidos: certificadoIds e email são obrigatórios", 
                                          HttpStatus.BAD_REQUEST);
            }

            boolean enviado = emailService.enviarCertificadosPorEmailComTratamento(certificadoIds, emailDestinatario);
            
            if (enviado) {
                return new ResponseEntity<>("Certificados enviados com sucesso para: " + emailDestinatario, 
                                          HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Falha ao enviar certificados", 
                                          HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
        } catch (Exception e) {
            return new ResponseEntity<>("Erro: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Versão alternativa que busca o email automaticamente pelo CPF
    @PostMapping("/enviar-email/{cpf}")
    public ResponseEntity<String> enviarCertificadosPorEmailAutomatico(
            @PathVariable String cpf, 
            @RequestBody List<Long> certificadoIds) {
        
        try {
            if (certificadoIds == null || certificadoIds.isEmpty()) {
                return new ResponseEntity<>("Lista de certificadoIds é obrigatória", 
                                          HttpStatus.BAD_REQUEST);
            }

            // Buscar email do usuário pelo CPF
            String emailDestinatario = certificadoService.buscarEmailPorCpf(cpf);
            
            emailService.enviarCertificadosPorEmail(certificadoIds, emailDestinatario);
            
            return new ResponseEntity<>("Certificados enviados com sucesso para: " + emailDestinatario, 
                                      HttpStatus.OK);
            
        } catch (MessagingException e) {
            return new ResponseEntity<>("Erro ao enviar email: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            return new ResponseEntity<>("Erro de IO ao gerar PDFs: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (DocumentException e) {
            return new ResponseEntity<>("Erro ao gerar documentos PDF: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro: " + e.getMessage(), 
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}