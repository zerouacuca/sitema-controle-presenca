package com.example.presenca_system.service;

import com.example.presenca_system.dto.UsuarioListDTO;
import com.example.presenca_system.dto.UsuarioTemplateDTO;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Métodos CRUD
    public Usuario salvarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorCpf(String cpf) {
        return usuarioRepository.findById(cpf);
    }

    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    // Métodos para listagem e validação
    public List<UsuarioListDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaUsuarioListDTO)
                .collect(Collectors.toList());
    }

    public List<UsuarioTemplateDTO> listarTemplatesParaValidacao() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaUsuarioTemplateDTO)
                .collect(Collectors.toList());
    }

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
