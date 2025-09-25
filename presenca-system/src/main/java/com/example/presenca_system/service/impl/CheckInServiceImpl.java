package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.CheckInResponseDTO;
import com.example.presenca_system.model.enums.StatusCheckIn;
import com.example.presenca_system.repository.CheckInRepository;
import com.example.presenca_system.repository.EventoRepository;
import com.example.presenca_system.repository.UsuarioRepository;
import com.example.presenca_system.service.CheckInService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // 🔐 NOVO MÉTODO PARA VALIDAÇÃO POR SUPERUSUÁRIO
    @Override
    public List<CheckInResponseDTO> findCheckInsPorEventoESuperusuario(Long eventoId, String emailSuperusuario) {
        Optional<Evento> eventoOpt = eventoRepository.findByIdAndSuperusuarioEmail(eventoId, emailSuperusuario);
        if (eventoOpt.isEmpty()) {
            throw new RuntimeException("Evento não encontrado ou acesso negado");
        }
        
        // 🔧 CORREÇÃO: Usar o nome correto do campo
        List<CheckIn> checkIns = checkInRepository.findByEvento_EventoId(eventoId);
        
        return checkIns.stream().map(checkIn -> {
            CheckInResponseDTO dto = new CheckInResponseDTO();
            dto.setId(checkIn.getId());
            dto.setEventoId(checkIn.getEvento().getEventoId()); // 🔧 Usar getEventoId()
            dto.setEventoTitulo(checkIn.getEvento().getTitulo());
            dto.setUsuarioCpf(checkIn.getUsuario().getCpf());
            dto.setUsuarioNome(checkIn.getUsuario().getNome());
            dto.setDataHoraCheckin(checkIn.getDataHoraCheckin());
            dto.setStatus(checkIn.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    // MÉTODOS EXISTENTES (mantidos conforme seu código)
    @Override
    public String registrarCheckInBiometrico(byte[] templateBiometrico, Long eventoId) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByTemplate(templateBiometrico);
        if (usuarioOpt.isEmpty()) {
            return "Usuário não encontrado. Biometria não corresponde a nenhum usuário cadastrado.";
        }
        Usuario usuario = usuarioOpt.get();

        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
        if (eventoOpt.isEmpty()) {
            return "Evento não encontrado.";
        }
        Evento evento = eventoOpt.get();

        Optional<CheckIn> checkInExistente = checkInRepository.findByUsuarioAndEvento(usuario, evento);
        if (checkInExistente.isPresent()) {
            return "Usuário já realizou o check-in para este evento.";
        }

        CheckIn novoCheckIn = new CheckIn();
        novoCheckIn.setUsuario(usuario);
        novoCheckIn.setEvento(evento);
        novoCheckIn.setDataHoraCheckin(new Date());
        novoCheckIn.setStatus(StatusCheckIn.PRESENTE);

        checkInRepository.save(novoCheckIn);

        return "Check-in realizado com sucesso para o usuário: " + usuario.getNome();
    }
    
    @Override
    public List<CheckInResponseDTO> findCheckInsPorEvento(Long eventoId) {
        List<CheckIn> checkIns = checkInRepository.findByEvento_EventoId(eventoId);
        
        return checkIns.stream().map(checkIn -> {
            CheckInResponseDTO dto = new CheckInResponseDTO();
            dto.setId(checkIn.getId());
            dto.setEventoId(checkIn.getEvento().getEventoId());
            dto.setEventoTitulo(checkIn.getEvento().getTitulo());
            dto.setUsuarioCpf(checkIn.getUsuario().getCpf());
            dto.setUsuarioNome(checkIn.getUsuario().getNome());
            dto.setDataHoraCheckin(checkIn.getDataHoraCheckin());
            dto.setStatus(checkIn.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }
}