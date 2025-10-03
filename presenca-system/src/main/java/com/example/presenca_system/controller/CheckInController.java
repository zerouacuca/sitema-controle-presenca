package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.CheckInRequestDTO;
import com.example.presenca_system.model.dto.CheckInResponseDTO;
import com.example.presenca_system.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/checkin") // ✅ Agora é protegido
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    // 🔓 Endpoint PÚBLICO - não exige autenticação
    @PostMapping("/biometrico")
    public ResponseEntity<String> registrarCheckInBiometrico(@RequestBody CheckInRequestDTO request) {
        try {
            byte[] templateBiometrico = java.util.Base64.getDecoder().decode(request.getTemplate());
            String resultado = checkInService.registrarCheckInBiometrico(templateBiometrico, request.getEventoId());

            if (resultado.startsWith("Check-in realizado")) {
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.badRequest().body(resultado);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Template biométrico em formato inválido");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno ao processar check-in");
        }
    }

    // 🔐 Endpoint PROTEGIDO - requer autenticação de superusuário
    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<CheckInResponseDTO>> getCheckInsPorEvento(
            @PathVariable Long eventoId, 
            Authentication authentication) {
        try {
            String emailSuperusuario = authentication.getName();
            List<CheckInResponseDTO> checkIns = checkInService.findCheckInsPorEventoESuperusuario(eventoId, emailSuperusuario);
            return ResponseEntity.ok(checkIns);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}