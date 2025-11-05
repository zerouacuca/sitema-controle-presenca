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
import java.util.Optional;
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

    // @Override
    // @Transactional
    // public void redefinirSenha(RedefinirSenhaRequest request) {
    //     if (!request.getNovaSenha().equals(request.getConfirmacaoSenha())) {
    //         throw new RuntimeException("As senhas não coincidem");
    //     }

    //     RecuperacaoSenha recuperacaoSenha = recuperacaoSenhaRepository
    //             .findByTokenAndUtilizadoFalse(request.getToken())
    //             .orElseThrow(() -> new RuntimeException("Token inválido ou expirado"));

    //     if (recuperacaoSenha.getDataExpiracao().isBefore(LocalDateTime.now())) {
    //         throw new RuntimeException("Token expirado");
    //     }

    //     Superusuario superusuario = superusuarioRepository
    //             .findByEmail(recuperacaoSenha.getEmail())
    //             .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    //     superusuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
    //     superusuarioRepository.save(superusuario);

    //     recuperacaoSenha.setUtilizado(true);
    //     recuperacaoSenhaRepository.save(recuperacaoSenha);
    // }

@Override
@Transactional
public void redefinirSenha(RedefinirSenhaRequest request) {
    System.out.println("=== TENTANDO REDEFINIR SENHA ===");
    System.out.println("Token recebido: " + request.getToken());
    System.out.println("Nova senha: " + request.getNovaSenha());
    System.out.println("Confirmação: " + request.getConfirmacaoSenha());
    
    if (!request.getNovaSenha().equals(request.getConfirmacaoSenha())) {
        System.err.println(" Erro: Senhas não coincidem");
        throw new RuntimeException("As senhas não coincidem");
    }

    // Buscar token
    Optional<RecuperacaoSenha> tokenOpt = recuperacaoSenhaRepository
            .findByTokenAndUtilizadoFalse(request.getToken());
    
    System.out.println("Token encontrado no banco: " + tokenOpt.isPresent());
    
    if (tokenOpt.isEmpty()) {
        System.err.println(" Token não encontrado ou já utilizado");
        throw new RuntimeException("Token inválido ou expirado");
    }

    RecuperacaoSenha recuperacaoSenha = tokenOpt.get();
    System.out.println("Token details:");
    System.out.println(" - Email: " + recuperacaoSenha.getEmail());
    System.out.println(" - Criado: " + recuperacaoSenha.getDataCriacao());
    System.out.println(" - Expira: " + recuperacaoSenha.getDataExpiracao());
    System.out.println(" - Utilizado: " + recuperacaoSenha.isUtilizado());
    System.out.println(" - Agora: " + LocalDateTime.now());
    System.out.println(" - Token expirado? " + recuperacaoSenha.getDataExpiracao().isBefore(LocalDateTime.now()));

    if (recuperacaoSenha.getDataExpiracao().isBefore(LocalDateTime.now())) {
        System.err.println(" Token expirado");
        throw new RuntimeException("Token expirado");
    }

    // Buscar usuário
    Optional<Superusuario> superusuarioOpt = superusuarioRepository
            .findByEmail(recuperacaoSenha.getEmail());
    
    System.out.println("Usuário encontrado: " + superusuarioOpt.isPresent());
    
    if (superusuarioOpt.isEmpty()) {
        System.err.println(" Usuário não encontrado para o email: " + recuperacaoSenha.getEmail());
        throw new RuntimeException("Usuário não encontrado");
    }

    Superusuario superusuario = superusuarioOpt.get();
    System.out.println("Atualizando senha para usuário: " + superusuario.getEmail());

    // Atualizar senha
    superusuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
    superusuarioRepository.save(superusuario);

    // Marcar token como utilizado
    recuperacaoSenha.setUtilizado(true);
    recuperacaoSenhaRepository.save(recuperacaoSenha);

    System.out.println(" Senha redefinida com sucesso!");
    System.out.println("=== FIM REDEFINIÇÃO ===");
}
}