package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.dto.RelatorioConsolidadoDTO;
import com.example.presenca_system.model.enums.StatusEvento;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.repository.SuperusuarioRepository;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private SuperusuarioRepository superusuarioRepository;

    @Autowired
    private CertificadoService certificadoService;

    @GetMapping
    public List<EventoDTO> getMeusEventos(Authentication authentication) {
        return eventoService.findAllDTO();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id, Authentication authentication) {
        Optional<EventoDTO> evento = eventoService.findByIdDTO(id);
        return evento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createEvento(@RequestBody Evento evento, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        Optional<Superusuario> superusuario = superusuarioRepository.findByEmail(emailSuperusuario);
        
        if (superusuario.isEmpty()) {
            return ResponseEntity.badRequest().body("Superusuário não encontrado");
        }
        
        evento.setSuperusuario(superusuario.get());
        eventoService.save(evento);
        return ResponseEntity.ok("Evento criado com sucesso");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateEvento(@PathVariable Long id, @RequestBody Evento evento, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        Optional<Evento> eventoExistente = eventoService.findByIdAndSuperusuarioEmailEntity(id, emailSuperusuario);
        
        if (eventoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        evento.setSuperusuario(eventoExistente.get().getSuperusuario());
        eventoService.update(id, evento);
        return ResponseEntity.ok("Evento atualizado com sucesso");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvento(@PathVariable Long id, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        Optional<Evento> evento = eventoService.findByIdAndSuperusuarioEmailEntity(id, emailSuperusuario);
        
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        eventoService.deleteById(id);
        return ResponseEntity.ok("Evento removido com sucesso");
    }

    @PostMapping("/{eventoId}/encerrar")
    public ResponseEntity<String> encerrarEventoEGerarCertificados(@PathVariable Long eventoId, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        Optional<Evento> eventoOpt = eventoService.findByIdAndSuperusuarioEmailEntity(eventoId, emailSuperusuario);
        
        if (eventoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Evento evento = eventoOpt.get();
        evento.setStatus(StatusEvento.FINALIZADO);
        
        eventoService.save(evento);
        certificadoService.gerarCertificadosParaEvento(evento);
        
        return ResponseEntity.ok("Evento encerrado e certificados gerados com sucesso!");
    }

    @PatchMapping("/{eventoId}/status")
    public ResponseEntity<String> atualizarStatus(@PathVariable Long eventoId, @RequestParam StatusEvento status, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        Optional<Evento> evento = eventoService.findByIdAndSuperusuarioEmailEntity(eventoId, emailSuperusuario);
        
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        eventoService.atualizarStatus(eventoId, status);
        return ResponseEntity.ok("Status do evento atualizado para: " + status);
    }

    @PostMapping("/{eventoId}/cancelar")
    public ResponseEntity<String> cancelarEvento(@PathVariable Long eventoId, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        Optional<Evento> evento = eventoService.findByIdAndSuperusuarioEmailEntity(eventoId, emailSuperusuario);
        
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        eventoService.cancelarEvento(eventoId);
        return ResponseEntity.ok("Evento cancelado com sucesso!");
    }

    @GetMapping("/exportar/csv")
    public ResponseEntity<String> exportarEventosCSV(
            @RequestParam("eventoIds") List<Long> eventoIds,
            Authentication authentication) {
        
        String emailSuperusuario = authentication.getName();
        
        try {
            String csvData = eventoService.gerarEventosCSV(eventoIds, emailSuperusuario);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "relatorio_eventos.csv");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvData);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao gerar CSV: " + e.getMessage());
        }
    }

    @GetMapping("/exportar/json")
    public ResponseEntity<?> exportarEventosJSON(
            @RequestParam("eventoIds") List<Long> eventoIds,
            Authentication authentication) {
        
        String emailSuperusuario = authentication.getName();
        
        try {
            RelatorioConsolidadoDTO relatorio = eventoService.gerarEventosJSON(eventoIds, emailSuperusuario);
            return ResponseEntity.ok(relatorio);
                    
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao gerar JSON: " + e.getMessage());
        }
    }
}