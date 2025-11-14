package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.dto.EventoDTO;
import com.example.presenca_system.model.dto.RelatorioConsolidadoDTO;
import com.example.presenca_system.model.dto.RelatorioEventoDTO;
import com.example.presenca_system.model.dto.ResumoDTO;
import com.example.presenca_system.model.enums.StatusEvento;
import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.repository.CheckInRepository;
import com.example.presenca_system.repository.EventoRepository;
import com.example.presenca_system.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventoServiceImpl implements EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private CheckInRepository checkInRepository;

    //   NOVOS MÉTODOS PARA VALIDAÇÃO POR SUPERUSUÁRIO
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
    @Transactional(readOnly = true) 
    public Optional<Evento> findByIdAndSuperusuarioEmailEntity(Long id, String emailSuperusuario) {
        Optional<Evento> eventoOpt = eventoRepository.findById(id);
        eventoOpt.ifPresent(evento -> evento.getCheckIns().size()); 
        return eventoOpt;
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

    @Override
    @Transactional(readOnly = true) // Garante que os check-ins sejam carregados
    public RelatorioConsolidadoDTO gerarEventosJSON(List<Long> eventoIds, String emailSuperusuario) {
        List<RelatorioEventoDTO> eventosDTO = new ArrayList<>();
        double totalHoras = 0;
        long totalParticipantes = 0;

        for (Long eventoId : eventoIds) {
            Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
            if (eventoOpt.isPresent()) {
                Evento evento = eventoOpt.get();
                // Força o carregamento dos check-ins (agora funciona)
                evento.getCheckIns().size(); 
                
                eventosDTO.add(new RelatorioEventoDTO(evento));
                
                totalHoras += evento.getCargaHoraria();
                totalParticipantes += evento.getCheckIns().size();
            }
        }

        ResumoDTO resumo = new ResumoDTO(eventosDTO.size(), totalHoras, totalParticipantes);
        return new RelatorioConsolidadoDTO(eventosDTO, resumo);
    }


    @Override
    @Transactional(readOnly = true)
    public String gerarEventosCSV(List<Long> eventoIds, String emailSuperusuario) {
        StringBuilder csv = new StringBuilder();
        // Cabeçalho principal do CSV
        csv.append("ID_EVENTO;TITULO_EVENTO;DATA_EVENTO;CATEGORIA;CARGA_HORARIA;STATUS_EVENTO;MATRICULA_USUARIO;NOME_USUARIO;EMAIL_USUARIO;SETOR_USUARIO;DATA_CHECKIN\n");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        double totalHoras = 0;
        long totalParticipantes = 0;
        long totalEventosProcessados = 0;

        for (Long eventoId : eventoIds) {
            // Verifica se o evento pertence ao superusuário
            Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
            if (eventoOpt.isPresent()) {
                Evento evento = eventoOpt.get();
                List<CheckIn> checkIns = evento.getCheckIns(); // Acessa os check-ins já carregados

                // Acumula totais
                totalEventosProcessados++;
                totalHoras += evento.getCargaHoraria();
                totalParticipantes += checkIns.size();

                String dataEventoStr = (evento.getDataHora() != null) ? sdf.format(evento.getDataHora()) : "N/A";

                if (checkIns.isEmpty()) {
                    // Se não houver check-ins, lista o evento mesmo assim
                    csv.append(String.format("\"%d\";\"%s\";\"%s\";\"%s\";\"%.1f\";\"%s\";\"%s\";\"%s\";\"%s\";\"%s\";\"%s\"\n",
                            evento.getEventoId(),
                            evento.getTitulo(),
                            dataEventoStr,
                            evento.getCategoria(),
                            evento.getCargaHoraria(),
                            evento.getStatus().name(),
                            "N/A", "Nenhum check-in", "N/A", "N/A", "N/A"
                    ));
                } else {
                    // Lista o evento para cada check-in
                    for (CheckIn checkIn : checkIns) {
                        String dataCheckinStr = (checkIn.getDataHoraCheckin() != null) ? sdf.format(checkIn.getDataHoraCheckin()) : "N/A";
                        csv.append(String.format("\"%d\";\"%s\";\"%s\";\"%s\";\"%.1f\";\"%s\";\"%s\";\"%s\";\"%s\";\"%s\";\"%s\"\n",
                                evento.getEventoId(),
                                evento.getTitulo(),
                                dataEventoStr,
                                evento.getCategoria(),
                                evento.getCargaHoraria(),
                                evento.getStatus().name(),
                                checkIn.getUsuario().getMatricula(),
                                checkIn.getUsuario().getNome(),
                                checkIn.getUsuario().getEmail(),
                                checkIn.getUsuario().getSetor(),
                                dataCheckinStr
                        ));
                    }
                }
            }
        }

        // Adiciona o sumário ao final
        csv.append("\n\n");
        csv.append("RESUMO DO RELATÓRIO\n");
        csv.append(String.format("Total de Eventos:;%d\n", totalEventosProcessados));
        csv.append(String.format("Total de Horas:;%.1f\n", totalHoras));
        csv.append(String.format("Total de Participantes (Check-ins):;%d\n", totalParticipantes));

        return csv.toString();
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
        
        // --- LINHA CORRIGIDA ---
        // Antes: (long) (evento.getCargaHoraria() * 60 * 60 * 1000)
        // Agora: (long) (evento.getCargaHoraria() * 60 * 1000)
        Date fimEvento = new Date(dataEvento.getTime() + (long) (evento.getCargaHoraria() * 60 * 1000));
        
        if (agora.after(dataEvento) && agora.before(fimEvento)) {
            return StatusEvento.EM_ANDAMENTO;
        }
        
        if (agora.after(fimEvento)) {
            return StatusEvento.FINALIZADO;
        }
        
        return StatusEvento.AGENDADO;
    }
}