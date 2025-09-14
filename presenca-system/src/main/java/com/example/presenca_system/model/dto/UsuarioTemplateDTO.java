package com.example.presenca_system.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioTemplateDTO {

    /* Usado para tranferir lista com templates dos usuários */


    private String id;
    private byte[] template;
}
