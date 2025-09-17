package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.repository.EventoRepository;
import com.example.presenca_system.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventoServiceImpl implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Override
    public List<EventoDTO> findAllDTO() {
        return eventoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EventoDTO> findByIdDTO(Long id) {
        return eventoRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Override
    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }
    
    @Override
    public Optional<Evento> update(Long id, Evento evento) {
        return eventoRepository.findById(id).map(existingEvento -> {
            existingEvento.setTitulo(evento.getTitulo());
            existingEvento.setDescricao(evento.getDescricao());
            existingEvento.setDataHora(evento.getDataHora());
            existingEvento.setCategoria(evento.getCategoria());
            existingEvento.setCargaHoraria(evento.getCargaHoraria());
            return eventoRepository.save(existingEvento);
        });
    }

    // Métodos antigos para compatibilidade
    @Override
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Override
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }

    private EventoDTO convertToDTO(Evento evento) {
        EventoDTO dto = new EventoDTO();
        dto.setEventoId(evento.getEventoId());
        dto.setTitulo(evento.getTitulo());
        dto.setDescricao(evento.getDescricao());
        dto.setDataHora(evento.getDataHora());
        dto.setCategoria(evento.getCategoria());
        dto.setCargaHoraria(evento.getCargaHoraria());
        dto.setStatus(calcularStatus(evento));
        return dto;
    }

    private String calcularStatus(Evento evento) {
        Date agora = new Date();
        if (evento.getDataHora().after(agora)) {
            return "agendado";
        } else {
            return "finalizado";
        }
    }
}