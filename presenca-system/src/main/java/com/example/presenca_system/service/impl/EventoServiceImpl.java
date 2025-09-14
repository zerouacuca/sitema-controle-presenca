package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.Evento;
import com.example.presenca_system.repository.EventoRepository;
import com.example.presenca_system.service.EventoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoServiceImpl implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Override
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Override
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
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
}