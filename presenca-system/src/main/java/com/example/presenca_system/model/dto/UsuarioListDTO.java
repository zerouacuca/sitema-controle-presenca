package com.example.presenca_system.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioListDTO {
    private String nome;
    private String matricula;
    private String setor;
    private String email;
    private LocalDate dataNascimento;
}