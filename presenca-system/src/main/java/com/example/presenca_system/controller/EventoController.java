package com.example.presenca_system.controller;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.enums.StatusEvento;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.repository.SuperusuarioRepository;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
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
        String emailSuperusuario = authentication.getName();
        return eventoService.findBySuperusuarioEmail(emailSuperusuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> getEventoById(@PathVariable Long id, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        Optional<EventoDTO> evento = eventoService.findByIdAndSuperusuarioEmail(id, emailSuperusuario);
        return evento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Evento> createEvento(@RequestBody Evento evento, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        Optional<Superusuario> superusuario = superusuarioRepository.findByEmail(emailSuperusuario);
        
        if (superusuario.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        evento.setSuperusuario(superusuario.get());
        Evento eventoSaved = eventoService.save(evento);
        return ResponseEntity.ok(eventoSaved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> updateEvento(@PathVariable Long id, @RequestBody Evento evento, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        // 🔧 CORREÇÃO: Usar o método que retorna a entidade Evento, não DTO
        Optional<Evento> eventoExistente = eventoService.findByIdAndSuperusuarioEmailEntity(id, emailSuperusuario);
        
        if (eventoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        evento.setSuperusuario(eventoExistente.get().getSuperusuario());
        return eventoService.update(id, evento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvento(@PathVariable Long id, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        // 🔧 CORREÇÃO: Usar o método que retorna a entidade Evento
        Optional<Evento> evento = eventoService.findByIdAndSuperusuarioEmailEntity(id, emailSuperusuario);
        
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        eventoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventoId}/encerrar")
    public ResponseEntity<String> encerrarEventoEGerarCertificados(@PathVariable Long eventoId, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        // 🔧 CORREÇÃO: Usar o método que retorna a entidade Evento
        Optional<Evento> eventoOpt = eventoService.findByIdAndSuperusuarioEmailEntity(eventoId, emailSuperusuario);
        
        if (eventoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Evento evento = eventoOpt.get();
        evento.setStatus(StatusEvento.FINALIZADO);
        
        // 🔧 CORREÇÃO: Salvar através do serviço
        eventoService.save(evento);
        
        certificadoService.gerarCertificadosParaEvento(evento);
        return ResponseEntity.ok("Certificados gerados com sucesso para o evento " + evento.getTitulo() + "!");
    }

    @PatchMapping("/{eventoId}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long eventoId, @RequestParam StatusEvento status, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        // 🔧 CORREÇÃO: Usar o método que retorna a entidade Evento
        Optional<Evento> evento = eventoService.findByIdAndSuperusuarioEmailEntity(eventoId, emailSuperusuario);
        
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        eventoService.atualizarStatus(eventoId, status);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{eventoId}/cancelar")
    public ResponseEntity<String> cancelarEvento(@PathVariable Long eventoId, Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        
        // 🔧 CORREÇÃO: Usar o método que retorna a entidade Evento
        Optional<Evento> evento = eventoService.findByIdAndSuperusuarioEmailEntity(eventoId, emailSuperusuario);
        
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        eventoService.cancelarEvento(eventoId);
        return ResponseEntity.ok("Evento cancelado com sucesso!");
    }
}