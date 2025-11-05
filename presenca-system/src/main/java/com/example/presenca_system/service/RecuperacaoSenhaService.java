package com.example.presenca_system.service;

import com.example.presenca_system.model.dto.RecuperarSenhaRequest;
import com.example.presenca_system.model.dto.RedefinirSenhaRequest;

public interface RecuperacaoSenhaService {
    void solicitarRecuperacao(RecuperarSenhaRequest request);
    void redefinirSenha(RedefinirSenhaRequest request);
}