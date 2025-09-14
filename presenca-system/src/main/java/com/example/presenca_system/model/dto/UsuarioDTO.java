package com.example.presenca_system.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Date;

@Data
public class UsuarioDTO {
    private String cpf;
    private String nome;
    private String matricula;
    private String setor;
    
    // Mapeia o campo "template" do JSON para o atributo template do Java
    @JsonProperty("template")
    private String template;

    // Mapeia o campo "dataNascimento" do JSON para o atributo dataNascimento do Java
    @JsonProperty("dataNascimento")
    private Date dataNascimento;
}
