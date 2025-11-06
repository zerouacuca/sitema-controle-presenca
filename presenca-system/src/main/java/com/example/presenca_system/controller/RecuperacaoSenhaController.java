package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.RecuperarSenhaRequest;
import com.example.presenca_system.model.dto.RedefinirSenhaRequest;
import com.example.presenca_system.service.RecuperacaoSenhaService;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class RecuperacaoSenhaController {

    private final RecuperacaoSenhaService recuperacaoSenhaService;

    public RecuperacaoSenhaController(RecuperacaoSenhaService recuperacaoSenhaService) {
        this.recuperacaoSenhaService = recuperacaoSenhaService;
    }

    @PostMapping("/recuperar-senha")
    public ResponseEntity<String> recuperarSenha(@RequestBody RecuperarSenhaRequest request) {
        try {
            recuperacaoSenhaService.solicitarRecuperacao(request);
            return ResponseEntity.ok("E-mail de recuperação enviado caso o endereço esteja cadastrado");
        } catch (Exception e) {
            // Log do erro, mas retorna mesma mensagem por segurança
            System.err.println("Erro no processo de recuperação: " + e.getMessage());
            return ResponseEntity.ok("E-mail de recuperação enviado caso o endereço esteja cadastrado");
        }
    }

    // RecuperacaoSenhaController.java
    @PostMapping("/redefinir-senha")
    public ResponseEntity<Map<String, String>> redefinirSenha(@RequestBody RedefinirSenhaRequest request) {
    try {
        recuperacaoSenhaService.redefinirSenha(request);
        // Retorne JSON em vez de String
        return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso"));
    } catch (Exception e) {
        // Mesmo em caso de erro, retorne JSON
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
    }
}