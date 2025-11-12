package com.example.presenca_system.model.dto;

import com.example.presenca_system.model.Evento;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class RelatorioEventoDTO {
    private Long eventoId;
    private String titulo;
    private String dataHora;
    private String categoria;
    private double cargaHoraria;
    private String status;
    private List<RelatorioCheckInDTO> checkIns;

    public RelatorioEventoDTO(Evento evento) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.eventoId = evento.getEventoId();
        this.titulo = evento.getTitulo();
        this.dataHora = (evento.getDataHora() != null) ? sdf.format(evento.getDataHora()) : "N/A";
        this.categoria = evento.getCategoria();
        this.cargaHoraria = evento.getCargaHoraria();
        this.status = evento.getStatus().name();
        this.checkIns = evento.getCheckIns().stream()
                .map(RelatorioCheckInDTO::new)
                .collect(Collectors.toList());
    }
}