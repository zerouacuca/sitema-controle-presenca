package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.model.dto.UsuarioTemplateDTO;
import com.example.presenca_system.repository.UsuarioRepository;
import com.example.presenca_system.service.UsuarioService;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Métodos CRUD
    @Override
    public Usuario salvarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorCpf(String cpf) {
        return usuarioRepository.findById(cpf);
    }

    @Override
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    // Métodos para listagem e validação
    @Override
    public List<UsuarioListDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaUsuarioListDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UsuarioTemplateDTO> listarTemplatesParaValidacao() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaUsuarioTemplateDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Usuario> validarBiometria(byte[] hashParaValidar) {
        List<Usuario> todosUsuarios = usuarioRepository.findAll();

        for (Usuario usuario : todosUsuarios) {
            if (Arrays.equals(usuario.getTemplate(), hashParaValidar)) {
                return Optional.of(usuario);
            }
        }
        return Optional.empty();
    }

    // Métodos de conversão DTO
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