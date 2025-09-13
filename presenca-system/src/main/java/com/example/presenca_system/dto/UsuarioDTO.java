package com.example.presenca_system.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Date;

@Data
public class UsuarioDTO {
    private String cpf;
    private String nome;
    private String matricula;
    private String setor;
    
    // Mapeia o campo "biometriaHash" do JSON para o atributo hashBiometria do Java
    @JsonProperty("biometriaHash")
    private String hashBiometria;

    // Mapeia o campo "dataNascimento" do JSON para o atributo dataNascimento do Java
    @JsonProperty("dataNascimento")
    private Date dataNascimento;
}
