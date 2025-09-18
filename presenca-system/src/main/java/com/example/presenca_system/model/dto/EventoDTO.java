package com.example.presenca_system.model.dto;

import lombok.Data;
import java.util.Date;

import com.example.presenca_system.model.enums.StatusEvento;

@Data
public class EventoDTO {
    private Long eventoId;
    private String titulo;
    private String descricao;
    private Date dataHora;
    private String categoria;
    private double cargaHoraria;
    private StatusEvento status; // Use o enum diretamente

    public EventoDTO() {}
}