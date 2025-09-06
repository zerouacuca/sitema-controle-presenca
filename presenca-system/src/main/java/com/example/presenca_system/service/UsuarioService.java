package com.example.presenca_system.service;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario salvarUsuario(Usuario usuario) {
        // Você pode adicionar lógicas de validação de negócio aqui antes de salvar
        return usuarioRepository.save(usuario);
    }

    // Método para buscar todos os usuários
    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    // Método para buscar um usuário por CPF
    public Optional<Usuario> buscarPorCpf(String cpf) {
        return usuarioRepository.findById(cpf);
    }

    // Método para deletar um usuário por CPF
    public void deletarUsuario(String cpf) {
        usuarioRepository.deleteById(cpf);
    }

    public Optional<Usuario> validarBiometria(byte[] hashParaValidar) {
        List<Usuario> todosUsuarios = usuarioRepository.findAll();

        for (Usuario usuario : todosUsuarios) {
            if (Arrays.equals(usuario.getHashBiometria(), hashParaValidar)) {
                return Optional.of(usuario); // Retorna o usuário encontrado
            }
        }
        return Optional.empty(); // Retorna vazio se nenhum usuário corresponder
    }
}