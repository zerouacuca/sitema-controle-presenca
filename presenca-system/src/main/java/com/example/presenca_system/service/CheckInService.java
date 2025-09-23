package com.example.presenca_system.service;

import java.util.List;

import com.example.presenca_system.model.dto.CheckInResponseDTO;

public interface CheckInService {
    
    String registrarCheckInBiometrico(byte[] templateBiometrico, Long eventoId);
    List<CheckInResponseDTO> findCheckInsPorEvento(Long eventoId);
    
}