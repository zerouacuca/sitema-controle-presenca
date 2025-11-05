package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.RecuperacaoSenha;
import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.model.dto.RecuperarSenhaRequest;
import com.example.presenca_system.model.dto.RedefinirSenhaRequest;
import com.example.presenca_system.repository.RecuperacaoSenhaRepository;
import com.example.presenca_system.repository.SuperusuarioRepository;
import com.example.presenca_system.service.EmailService;
import com.example.presenca_system.service.RecuperacaoSenhaService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RecuperacaoSenhaServiceImpl implements RecuperacaoSenhaService {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private final RecuperacaoSenhaRepository recuperacaoSenhaRepository;
    private final SuperusuarioRepository superusuarioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public RecuperacaoSenhaServiceImpl(
            RecuperacaoSenhaRepository recuperacaoSenhaRepository,
            SuperusuarioRepository superusuarioRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.recuperacaoSenhaRepository = recuperacaoSenhaRepository;
        this.superusuarioRepository = superusuarioRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void solicitarRecuperacao(RecuperarSenhaRequest request) {
        // Verificar se existe superusuário com este email
        superusuarioRepository.findByEmail(request.getEmail()).ifPresent(superusuario -> {
            // Invalidar tokens anteriores
            recuperacaoSenhaRepository.findByEmailAndUtilizadoFalse(request.getEmail())
                    .ifPresent(token -> {
                        token.setUtilizado(true);
                        recuperacaoSenhaRepository.save(token);
                    });

            // Criar novo token
            RecuperacaoSenha recuperacaoSenha = new RecuperacaoSenha();
            recuperacaoSenha.setEmail(request.getEmail());
            recuperacaoSenha.setToken(UUID.randomUUID().toString());
            recuperacaoSenha.setDataCriacao(LocalDateTime.now());
            recuperacaoSenha.setDataExpiracao(LocalDateTime.now().plusHours(1));
            recuperacaoSenha.setUtilizado(false);
            recuperacaoSenha.setSuperusuario(superusuario);
            
            recuperacaoSenhaRepository.save(recuperacaoSenha);

            // Enviar email
            String link = frontendUrl + "/redefinir-senha?token=" + recuperacaoSenha.getToken();
            emailService.enviarEmailRecuperacaoSenha(request.getEmail(), link);
        });
        // Não informamos se o email existe ou não por segurança
    }

    @Override
    @Transactional
    public void redefinirSenha(RedefinirSenhaRequest request) {
        if (!request.getNovaSenha().equals(request.getConfirmacaoSenha())) {
            throw new RuntimeException("As senhas não coincidem");
        }

        RecuperacaoSenha recuperacaoSenha = recuperacaoSenhaRepository
                .findByTokenAndUtilizadoFalse(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));

        if (recuperacaoSenha.getDataExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        Superusuario superusuario = superusuarioRepository
                .findByEmail(recuperacaoSenha.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        superusuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        superusuarioRepository.save(superusuario);

        recuperacaoSenha.setUtilizado(true);
        recuperacaoSenhaRepository.save(recuperacaoSenha);
    }
}