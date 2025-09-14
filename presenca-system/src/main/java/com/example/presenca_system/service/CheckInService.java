package com.example.presenca_system.service;

public interface CheckInService {
    
    String registrarCheckInBiometrico(byte[] templateBiometrico, Long eventoId);
    
}