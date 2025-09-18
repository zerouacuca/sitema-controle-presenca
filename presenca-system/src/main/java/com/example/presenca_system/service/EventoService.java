package com.example.presenca_system.service;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.enums.StatusEvento;
import com.example.presenca_system.model.Evento;

import java.util.List;
import java.util.Optional;

public interface EventoService {
    List<EventoDTO> findAllDTO();
    Optional<EventoDTO> findByIdDTO(Long id);
    Evento save(Evento evento);
    void deleteById(Long id);
    Optional<Evento> update(Long id, Evento evento);
    
    // métodos antigos para compatibilidade
    List<Evento> findAll();
    Optional<Evento> findById(Long id);
    
    // novos métodos para gerenciamento de status
    void atualizarStatus(Long eventoId, StatusEvento novoStatus);
    void encerrarEvento(Long eventoId);
    void cancelarEvento(Long eventoId);
}