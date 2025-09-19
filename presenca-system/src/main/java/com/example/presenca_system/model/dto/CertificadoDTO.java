// src/main/java/com/example/presenca_system/model/dto/CertificadoDTO.java
package com.example.presenca_system.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificadoDTO {
    private Long id;
    private String nomeUsuario;
    private String cpfUsuario;
    private String nomeSuperusuario;
    private String codigoValidacao;
    private LocalDate dataEmissao;
    private String texto;
    private Long eventoId;
    private String eventoTitulo;
    private Double eventoCargaHoraria;
}