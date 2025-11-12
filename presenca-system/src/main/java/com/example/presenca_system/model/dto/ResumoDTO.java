package com.example.presenca_system.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumoDTO {
    private long totalEventos;
    private double totalHoras;
    private long totalParticipantes;
}