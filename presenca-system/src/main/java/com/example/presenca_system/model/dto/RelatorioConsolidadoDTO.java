package com.example.presenca_system.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioConsolidadoDTO {
    private List<RelatorioEventoDTO> eventos;
    private ResumoDTO resumo;
}
