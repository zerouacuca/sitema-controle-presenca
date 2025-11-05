package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.RecuperarSenhaRequest;
import com.example.presenca_system.model.dto.RedefinirSenhaRequest;
import com.example.presenca_system.service.RecuperacaoSenhaService;
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
        recuperacaoSenhaService.solicitarRecuperacao(request);
        return ResponseEntity.ok("E-mail de recuperação enviado caso o endereço esteja cadastrado");
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody RedefinirSenhaRequest request) {
        recuperacaoSenhaService.redefinirSenha(request);
        return ResponseEntity.ok("Senha redefinida com sucesso");
    }
}