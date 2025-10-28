package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.model.dto.UsuarioTemplateDTO;
import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.repository.CheckInRepository;
import com.example.presenca_system.repository.UsuarioRepository;
import com.example.presenca_system.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CheckInRepository checkInRepository;
    private final CertificadoRepository certificadoRepository;

    @Autowired
    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              CheckInRepository checkInRepository,
                              CertificadoRepository certificadoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.checkInRepository = checkInRepository;
        this.certificadoRepository = certificadoRepository;
    }

    @Override
    public Usuario salvarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorCpf(String cpf) {
        return usuarioRepository.findById(cpf);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional
    public void deletarUsuario(String cpf) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(cpf);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            List<CheckIn> checkIns = usuario.getCheckIns();
            if (checkIns != null && !checkIns.isEmpty()) {
                 checkInRepository.deleteAll(checkIns);

            }

            List<Certificado> certificados = certificadoRepository.findByUsuarioCpf(cpf);
            if (!certificados.isEmpty()) {
                certificadoRepository.deleteAll(certificados);

            }

            usuarioRepository.deleteById(cpf);
        } else {

            System.err.println("Tentativa de excluir usuário inexistente com CPF: " + cpf);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioListDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaUsuarioListDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioTemplateDTO> listarTemplatesParaValidacao() {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getTemplate() != null)
                .map(this::converterParaUsuarioTemplateDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> validarBiometria(byte[] hashParaValidar) {

        List<Usuario> todosUsuarios = usuarioRepository.findAll();

        for (Usuario usuario : todosUsuarios) {
            if (usuario.getTemplate() != null && Arrays.equals(usuario.getTemplate(), hashParaValidar)) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }

    private UsuarioListDTO converterParaUsuarioListDTO(Usuario usuario) {
        UsuarioListDTO dto = new UsuarioListDTO();
        dto.setCpf(usuario.getCpf());
        dto.setNome(usuario.getNome());
        dto.setMatricula(usuario.getMatricula());
        dto.setSetor(usuario.getSetor());
        dto.setDataNascimento(usuario.getDataNascimento());
        return dto;
    }

    private UsuarioTemplateDTO converterParaUsuarioTemplateDTO(Usuario usuario) {
        UsuarioTemplateDTO dto = new UsuarioTemplateDTO();
        dto.setId(usuario.getCpf());
        dto.setTemplate(usuario.getTemplate());
        return dto;
    }

}