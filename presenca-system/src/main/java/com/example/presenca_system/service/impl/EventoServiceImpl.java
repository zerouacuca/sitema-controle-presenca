package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.enums.StatusEvento;
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

    // 🔐 NOVOS MÉTODOS PARA VALIDAÇÃO POR SUPERUSUÁRIO
    @Override
    public List<EventoDTO> findBySuperusuarioEmail(String emailSuperusuario) {
        return eventoRepository.findBySuperusuarioEmail(emailSuperusuario).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EventoDTO> findByIdAndSuperusuarioEmail(Long id, String emailSuperusuario) {
        return eventoRepository.findByIdAndSuperusuarioEmail(id, emailSuperusuario)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<Evento> findByIdAndSuperusuarioEmailEntity(Long id, String emailSuperusuario) {
        return eventoRepository.findByIdAndSuperusuarioEmail(id, emailSuperusuario);
    }

    // MÉTODOS EXISTENTES (mantidos conforme seu código)
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
        if (evento.getStatus() == null) {
            evento.setStatus(calcularStatus(evento));
        }
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
            
            if (evento.getStatus() != null) {
                existingEvento.setStatus(evento.getStatus());
            } else {
                existingEvento.setStatus(calcularStatus(existingEvento));
            }
            
            return eventoRepository.save(existingEvento);
        });
    }

    @Override
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Override
    public Optional<Evento> findById(Long id) {
        return eventoRepository.findById(id);
    }

    @Override
    public void atualizarStatus(Long eventoId, StatusEvento novoStatus) {
        eventoRepository.findById(eventoId).ifPresent(evento -> {
            evento.setStatus(novoStatus);
            eventoRepository.save(evento);
        });
    }

    @Override
    public void encerrarEvento(Long eventoId) {
        eventoRepository.findById(eventoId).ifPresent(evento -> {
            evento.setStatus(StatusEvento.FINALIZADO);
            eventoRepository.save(evento);
        });
    }

    @Override
    public void cancelarEvento(Long eventoId) {
        eventoRepository.findById(eventoId).ifPresent(evento -> {
            evento.setStatus(StatusEvento.CANCELADO);
            eventoRepository.save(evento);
        });
    }

    private EventoDTO convertToDTO(Evento evento) {
        EventoDTO dto = new EventoDTO();
        dto.setEventoId(evento.getEventoId());
        dto.setTitulo(evento.getTitulo());
        dto.setDescricao(evento.getDescricao());
        dto.setDataHora(evento.getDataHora());
        dto.setCategoria(evento.getCategoria());
        dto.setCargaHoraria(evento.getCargaHoraria());
        dto.setStatus(evento.getStatus());
        return dto;
    }

    private StatusEvento calcularStatus(Evento evento) {
        Date agora = new Date();
        Date dataEvento = evento.getDataHora();
        
        if (dataEvento.after(agora)) {
            return StatusEvento.AGENDADO;
        }
        
        Date fimEvento = new Date(dataEvento.getTime() + (long) (evento.getCargaHoraria() * 60 * 60 * 1000));
        
        if (agora.after(dataEvento) && agora.before(fimEvento)) {
            return StatusEvento.EM_ANDAMENTO;
        }
        
        if (agora.after(fimEvento)) {
            return StatusEvento.FINALIZADO;
        }
        
        return StatusEvento.AGENDADO;
    }
}