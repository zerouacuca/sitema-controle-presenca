package com.example.presenca_system.model.dto;

import lombok.Data;
import java.util.Date;

@Data
public class EventoDTO {
    private Long eventoId;
    private String titulo;
    private String descricao;
    private Date dataHora;
    private String categoria;
    private double cargaHoraria;
    private String status;

    public EventoDTO() {}
}