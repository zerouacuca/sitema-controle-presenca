package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.enums.StatusEvento;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.repository.EventoRepository;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private CertificadoService certificadoService;

    @GetMapping
    public List<EventoDTO> getAllEventos() {
        return eventoService.findAllDTO();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id) {
        return eventoService.findByIdDTO(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Evento createEvento(@RequestBody Evento evento) {
        return eventoService.save(evento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento evento) {
        return eventoService.update(id, evento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id) {
        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventoId}/encerrar")
    public ResponseEntity<String> encerrarEventoEGerarCertificados(@PathVariable Long eventoId) {
        return eventoRepository.findById(eventoId)
            .map(evento -> {
                // Atualiza o status para FINALIZADO
                evento.setStatus(StatusEvento.FINALIZADO);
                eventoRepository.save(evento);
                
                // Gera os certificados
                certificadoService.gerarCertificadosParaEvento(evento);
                return ResponseEntity.ok("Certificados gerados com sucesso para o evento " + evento.getTitulo() + "!");
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Novo endpoint para atualizar o status
    @PatchMapping("/{eventoId}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long eventoId, @RequestParam StatusEvento status) {
        eventoService.atualizarStatus(eventoId, status);
        return ResponseEntity.ok().build();
    }

    // Novo endpoint para cancelar evento
    @PostMapping("/{eventoId}/cancelar")
    public ResponseEntity<String> cancelarEvento(@PathVariable Long eventoId) {
        eventoService.cancelarEvento(eventoId);
        return ResponseEntity.ok("Evento cancelado com sucesso!");
    }
}