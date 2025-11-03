package com.example.presenca_system.model.dto;

import lombok.Data;

@Data
public class CheckInMatriculaRequestDTO {
    private Long eventoId;
    private String matricula;

    public CheckInMatriculaRequestDTO() {
    }

    public CheckInMatriculaRequestDTO(Long eventoId, String matricula) {
        this.eventoId = eventoId;
        this.matricula = matricula;
    }
}