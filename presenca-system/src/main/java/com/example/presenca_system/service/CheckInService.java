package com.example.presenca_system.service;

import com.example.presenca_system.model.dto.CheckInResponseDTO;
import java.util.List;

public interface CheckInService {
    
    String registrarCheckInPorMatricula(String matricula, Long eventoId);

    List<CheckInResponseDTO> findCheckInsPorEvento(Long eventoId);
    
    List<CheckInResponseDTO> findCheckInsPorEventoESuperusuario(Long eventoId, String emailSuperusuario);
}