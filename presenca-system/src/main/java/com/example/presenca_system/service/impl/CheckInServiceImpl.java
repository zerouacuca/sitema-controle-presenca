package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.enums.StatusCheckIn;
import com.example.presenca_system.repository.CheckInRepository;
import com.example.presenca_system.repository.EventoRepository; // Adicionado para buscar o evento
import com.example.presenca_system.repository.UsuarioRepository;
import com.example.presenca_system.service.CheckInService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class CheckInServiceImpl implements CheckInService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CheckInRepository checkInRepository;
    
    @Autowired
    private EventoRepository eventoRepository; // Repositório para obter o evento

    @Override
    public String registrarCheckInBiometrico(byte[] templateBiometrico, Long eventoId) {
        // 1. Encontrar o usuário pelo template biométrico
        Optional<Usuario> usuarioOpt = usuarioRepository.findByTemplate(templateBiometrico);
        if (usuarioOpt.isEmpty()) {
            return "Usuário não encontrado. Biometria não corresponde a nenhum usuário cadastrado.";
        }
        Usuario usuario = usuarioOpt.get();

        // 2. Encontrar o evento pelo ID
        Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
        if (eventoOpt.isEmpty()) {
            return "Evento não encontrado.";
        }
        Evento evento = eventoOpt.get();

        // 3. Verificar se o usuário já fez check-in neste evento
        Optional<CheckIn> checkInExistente = checkInRepository.findByUsuarioAndEvento(usuario, evento);
        if (checkInExistente.isPresent()) {
            return "Usuário já realizou o check-in para este evento.";
        }

        // 4. Criar e salvar o novo registro de Check-In
        CheckIn novoCheckIn = new CheckIn();
        novoCheckIn.setUsuario(usuario);
        novoCheckIn.setEvento(evento);
        novoCheckIn.setDataHoraCheckin(new Date());
        novoCheckIn.setStatus(StatusCheckIn.PRESENTE);

        checkInRepository.save(novoCheckIn);

        return "Check-in realizado com sucesso para o usuário: " + usuario.getNome();
    }
}