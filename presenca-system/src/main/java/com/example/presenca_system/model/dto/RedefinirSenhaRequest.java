package com.example.presenca_system.model.dto;

import lombok.Data;

@Data
public class RedefinirSenhaRequest {
    private String token;
    private String novaSenha;
    private String confirmacaoSenha;
}