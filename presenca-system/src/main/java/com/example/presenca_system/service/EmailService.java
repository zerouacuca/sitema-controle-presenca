// src/main/java/com/example/presenca_system/service/EmailService.java
package com.example.presenca_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.List;

import com.lowagie.text.DocumentException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private CertificadoService certificadoService;

    public void enviarCertificadosPorEmail(List<Long> certificadoIds, String destinatario) 
            throws MessagingException, IOException, DocumentException {
        
        // Buscar os certificados
        List<byte[]> pdfs = certificadoService.gerarPDFsPorIds(certificadoIds);
        
        if (pdfs.isEmpty()) {
            throw new RuntimeException("Nenhum certificado encontrado para os IDs fornecidos");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(destinatario);
        helper.setSubject("Seus Certificados");
        helper.setText("Olá! Seguem em anexo seus certificados solicitados.");

        // Anexar os PDFs
        for (int i = 0; i < pdfs.size(); i++) {
            helper.addAttachment("certificado_" + (i + 1) + ".pdf", 
                                new ByteArrayResource(pdfs.get(i)));
        }

        mailSender.send(message);
    }

    // Método alternativo que trata as exceções internamente
    public boolean enviarCertificadosPorEmailComTratamento(List<Long> certificadoIds, String destinatario) {
        try {
            enviarCertificadosPorEmail(certificadoIds, destinatario);
            return true;
        } catch (MessagingException | IOException | DocumentException e) {
            e.printStackTrace();
            return false;
        }
    }

    public void enviarEmailSimples(String destinatario, String assunto, String texto) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject(assunto);
        message.setText(texto);
        mailSender.send(message);
    }

    public void enviarEmailRecuperacaoSenha(String email, String link) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@presencasystem.com");
            message.setTo(email);
            message.setSubject("Recuperação de Senha - Sistema de Presença");
            message.setText(
                "Olá!\n\n" +
                "Você solicitou a recuperação de senha para sua conta.\n\n" +
                "Para redefinir sua senha, clique no link abaixo:\n" +
                link + "\n\n" +
                "Este link expira em 1 hora.\n\n" +
                "Se você não solicitou esta recuperação, ignore este e-mail.\n\n" +
                "Atenciosamente,\nSistema de Controle de Presença"
            );
            
            mailSender.send(message);
            System.out.println("Email de recuperação enviado para: " + email);
            
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
            throw new RuntimeException("Falha ao enviar email de recuperação", e);
        }
    }

}