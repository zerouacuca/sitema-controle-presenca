package com.example.presenca_system.controller;

import com.example.presenca_system.dto.CheckInRequestDTO; // Importe a classe DTO
import com.example.presenca_system.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/checkin")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    /**
     * Endpoint para registrar o check-in biométrico.
     * Recebe um DTO com o ID do evento e o template biométrico em Base64.
     * Retorna uma resposta HTTP com o resultado da operação.
     */
    @PostMapping("/biometrico")
    public ResponseEntity<String> registrarCheckInBiometrico(@RequestBody CheckInRequestDTO request) {
        try {
            // Decodifica a string Base64 para um array de bytes
            byte[] templateBiometrico = java.util.Base64.getDecoder().decode(request.getTemplate());
            
            // Chama o serviço para realizar o check-in
            String resultado = checkInService.registrarCheckInBiometrico(templateBiometrico, request.getEventoId());

            if (resultado.startsWith("Check-in realizado")) {
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.badRequest().body(resultado);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Template biométrico em formato inválido (não é Base64).");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ocorreu um erro interno ao processar o check-in.");
        }
    }
}