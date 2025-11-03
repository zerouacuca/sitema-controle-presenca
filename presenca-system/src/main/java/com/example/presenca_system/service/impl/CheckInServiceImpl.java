package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.CheckInResponseDTO;
import com.example.presenca_system.repository.CheckInRepository;
import com.example.presenca_system.repository.EventoRepository;
import com.example.presenca_system.repository.UsuarioRepository;
import com.example.presenca_system.service.CheckInService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CheckInServiceImpl implements CheckInService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CheckInRepository checkInRepository;
    
    @Autowired
    private EventoRepository eventoRepository;

    @Override
    @Transactional
    public String registrarCheckInPorMatricula(String matricula, Long eventoId) {
        // 1. Encontrar o usuário pela MATRÍCULA (PK)
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(matricula);
        if (usuarioOpt.isEmpty()) {
            return "Usuário não encontrado. Matrícula: " + matricula;
        }
        Usuario usuario = usuarioOpt.get();

        // 2. Encontrar o evento
        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
        if (eventoOpt.isEmpty()) {
            return "Evento não encontrado.";
        }
        Evento evento = eventoOpt.get();
        
        // 3. Verificar se o evento está em andamento (OPCIONAL, MAS RECOMENDADO)
        // if (evento.getStatus() != StatusEvento.EM_ANDAMENTO) {
        //     return "Check-in não pode ser realizado. Evento não está em andamento.";
        // }

        // 4. Verificar se já existe check-in
        Optional<CheckIn> checkInExistente = checkInRepository.findByUsuarioAndEvento(usuario, evento);
        if (checkInExistente.isPresent()) {
            return "Usuário já realizou o check-in para este evento.";
        }

        // 5. Salvar o novo check-in
        CheckIn novoCheckIn = new CheckIn();
        novoCheckIn.setUsuario(usuario);
        novoCheckIn.setEvento(evento);
        novoCheckIn.setDataHoraCheckin(new Date());

        checkInRepository.save(novoCheckIn);

        return "Check-in realizado com sucesso para: " + usuario.getNome();
    }
    
    @Override
    public List<CheckInResponseDTO> findCheckInsPorEvento(Long eventoId) {
        List<CheckIn> checkIns = checkInRepository.findByEvento_EventoId(eventoId);
        
        return checkIns.stream().map(checkIn -> {
            CheckInResponseDTO dto = new CheckInResponseDTO();
            dto.setId(checkIn.getId());
            dto.setEventoId(checkIn.getEvento().getEventoId());
            dto.setEventoTitulo(checkIn.getEvento().getTitulo());
            dto.setUsuarioMatricula(checkIn.getUsuario().getMatricula());
            dto.setUsuarioNome(checkIn.getUsuario().getNome());
            dto.setDataHoraCheckin(checkIn.getDataHoraCheckin());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CheckInResponseDTO> findCheckInsPorEventoESuperusuario(Long eventoId, String emailSuperusuario) {
        List<CheckIn> checkins = checkInRepository.findByEventoAndSuperusuarioEmail(eventoId, emailSuperusuario);
        
        return checkins.stream()
                .map(checkin -> {
                    CheckInResponseDTO dto = new CheckInResponseDTO();
                    dto.setId(checkin.getId());
                    dto.setUsuarioMatricula(checkin.getUsuario().getMatricula());
                    dto.setUsuarioNome(checkin.getUsuario().getNome());
                    dto.setDataHoraCheckin(checkin.getDataHoraCheckin());
                    dto.setEventoTitulo(checkin.getEvento().getTitulo());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}