package com.example.presenca_system.service;

import com.example.presenca_system.model.Evento;
import com.example.presenca_system.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }
    
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