package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.CheckInMatriculaRequestDTO;
import com.example.presenca_system.model.dto.CheckInResponseDTO;
import com.example.presenca_system.service.CheckInService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/checkin")
public class CheckInController {

    @Autowired
    private CheckInService checkInService;

    @PostMapping("/registrar")
    public ResponseEntity<String> registrarCheckInPorMatricula(@RequestBody CheckInMatriculaRequestDTO request) {
        try {
            String resultado = checkInService.registrarCheckInPorMatricula(request.getMatricula(), request.getEventoId());

            if (resultado.startsWith("Check-in realizado")) {
                return ResponseEntity.ok(resultado);
            } else {
                return ResponseEntity.badRequest().body(resultado);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno: " + e.getMessage());
        }
    }

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