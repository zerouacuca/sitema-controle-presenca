package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioDTO;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.model.dto.UsuarioTemplateDTO;
import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.repository.CheckInRepository;
import com.example.presenca_system.repository.UsuarioRepository;
import com.example.presenca_system.service.UsuarioService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CheckInRepository checkInRepository;
    private final CertificadoRepository certificadoRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              CheckInRepository checkInRepository,
                              CertificadoRepository certificadoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.checkInRepository = checkInRepository;
        this.certificadoRepository = certificadoRepository;
    }

    @Override
    @Transactional
    public Usuario cadastrarNovoUsuario(UsuarioDTO usuarioDto) {
        if (usuarioRepository.existsById(usuarioDto.getMatricula())) {
            throw new RuntimeException("Matrícula já cadastrada no sistema.");
        }
        
        Usuario novoUsuario = new Usuario();
        novoUsuario.setMatricula(usuarioDto.getMatricula());
        novoUsuario.setNome(usuarioDto.getNome());
        novoUsuario.setEmail(usuarioDto.getEmail());
        novoUsuario.setSetor(usuarioDto.getSetor());
        novoUsuario.setDataNascimento(usuarioDto.getDataNascimento() != null ?
        usuarioDto.getDataNascimento().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate() : null);

        if (usuarioDto.getTemplate() == null || usuarioDto.getTemplate().isEmpty()) {
             throw new IllegalArgumentException("Template biométrico não pode ser nulo.");
        }
        novoUsuario.setTemplate(usuarioDto.getTemplate());
     
        return usuarioRepository.save(novoUsuario);
    }

    @Override
    @Transactional
    public Usuario atualizarUsuarioExistente(String matricula, UsuarioDTO usuarioDto) {
        Usuario usuarioExistente = usuarioRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com a matrícula: " + matricula));

        usuarioExistente.setNome(usuarioDto.getNome());
        usuarioExistente.setEmail(usuarioDto.getEmail());
        usuarioExistente.setSetor(usuarioDto.getSetor());
        usuarioExistente.setDataNascimento(usuarioDto.getDataNascimento() != null ?
        usuarioDto.getDataNascimento().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate() : null);

        if (usuarioDto.getTemplate() != null && !usuarioDto.getTemplate().isEmpty()) {
            usuarioExistente.setTemplate(usuarioDto.getTemplate());
        }
        
        return usuarioRepository.save(usuarioExistente);
    }

    @Override
    @Transactional
    public Usuario salvarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorMatricula(String matricula) {
        return usuarioRepository.findById(matricula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional
    public void deletarUsuario(String matricula) {
        Usuario usuario = usuarioRepository.findById(matricula)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com a matrícula: " + matricula));

        List<CheckIn> checkIns = usuario.getCheckIns();
        if (checkIns != null && !checkIns.isEmpty()) {
            checkInRepository.deleteAll(checkIns);
        }

        List<Certificado> certificados = certificadoRepository.findByUsuarioMatricula(matricula);
        if (certificados != null && !certificados.isEmpty()) {
            certificadoRepository.deleteAll(certificados);
        }

        usuarioRepository.delete(usuario);
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
        // Este método está quebrado pois a entidade agora usa String.
        // Como não está sendo usado por nenhum controller, vamos apenas logar um aviso.
        // A implementação correta seria comparar strings.
        System.err.println("Atenção: validarBiometria(byte[]) não é mais suportado. Use string.");
        return Optional.empty(); 
        
        /* // Implementação correta se fosse string:
        List<Usuario> todosUsuarios = usuarioRepository.findAll();
        String hashString = Base64.getEncoder().encodeToString(hashParaValidar); // Exemplo
        for (Usuario usuario : todosUsuarios) {
            if (usuario.getTemplate() != null && usuario.getTemplate().equals(hashString)) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
        */
    }

    private UsuarioListDTO converterParaUsuarioListDTO(Usuario usuario) {
        UsuarioListDTO dto = new UsuarioListDTO();
        dto.setMatricula(usuario.getMatricula());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setSetor(usuario.getSetor());
        dto.setDataNascimento(usuario.getDataNascimento());
        return dto;
    }

    private UsuarioTemplateDTO converterParaUsuarioTemplateDTO(Usuario usuario) {
        UsuarioTemplateDTO dto = new UsuarioTemplateDTO();
        dto.setId(usuario.getMatricula());
        dto.setTemplate(usuario.getTemplate());
        return dto;
    }
}