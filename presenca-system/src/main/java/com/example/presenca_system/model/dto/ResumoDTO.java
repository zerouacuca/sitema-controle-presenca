package com.example.presenca_system.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
public class ResumoDTO {
    private long totalEventos;
    private double totalHoras;
    private long totalParticipantes; 
    private Map<String, Long> checkinsPorSetor;

    public ResumoDTO(long totalEventos, double totalHoras, long totalParticipantes, Map<String, Long> checkinsPorSetor) {
        this.totalEventos = totalEventos;
        this.totalHoras = totalHoras;
        this.totalParticipantes = totalParticipantes;
        this.checkinsPorSetor = checkinsPorSetor;
    }
}