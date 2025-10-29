package com.example.presenca_system.model.dto;

import lombok.Data;
import java.util.Date;

@Data
public class CheckInResponseDTO {
    private Long id;
    private String usuarioMatricula;
    private String usuarioNome;
    private Date dataHoraCheckin;
    private String eventoTitulo;
    private Long eventoId;

    public CheckInResponseDTO() {
    }

    public CheckInResponseDTO(Long id, String usuarioMatricula, String usuarioNome, Date dataHoraCheckin, String eventoTitulo) {
        this.id = id;
        this.usuarioMatricula = usuarioMatricula;
        this.usuarioNome = usuarioNome;
        this.dataHoraCheckin = dataHoraCheckin;
        this.eventoTitulo = eventoTitulo;
    }
}