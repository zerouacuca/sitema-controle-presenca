package com.example.presenca_system.model.dto;

import lombok.Data;
import java.util.Date;

@Data
public class CheckInResponseDTO {
    private Long id;
    private Long eventoId;
    private String eventoTitulo;
    private String usuarioCpf;
    private String usuarioNome;
    private Date dataHoraCheckin;
    
}