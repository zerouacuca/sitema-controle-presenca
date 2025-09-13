package com.example.presenca_system.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioTemplateDTO {
    private String id;
    private byte[] template;
}
