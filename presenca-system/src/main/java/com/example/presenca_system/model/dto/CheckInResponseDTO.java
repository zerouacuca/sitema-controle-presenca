package com.example.presenca_system.model.dto;

import lombok.Data;
import java.util.Date;

@Data
public class CheckInResponseDTO {
    private Long id;
    private String usuarioCpf;
    private String usuarioNome;
    private Date dataHoraCheckin;
    private String eventoTitulo;
    private Long eventoId;

    public CheckInResponseDTO() {
    }

    public CheckInResponseDTO(Long id, String usuarioCpf, String usuarioNome, Date dataHoraCheckin, String eventoTitulo) {
        this.id = id;
        this.usuarioCpf = usuarioCpf;
        this.usuarioNome = usuarioNome;
        this.dataHoraCheckin = dataHoraCheckin;
        this.eventoTitulo = eventoTitulo;
    }
}