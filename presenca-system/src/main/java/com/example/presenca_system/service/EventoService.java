package com.example.presenca_system.service;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.Evento;
import java.util.List;
import java.util.Optional;

public interface EventoService {
    List<EventoDTO> findAllDTO();
    Optional<EventoDTO> findByIdDTO(Long id);
    Evento save(Evento evento);
    void deleteById(Long id);
    Optional<Evento> update(Long id, Evento evento);
    
    // métodos antigos se necessário
    List<Evento> findAll();
    Optional<Evento> findById(Long id);
}