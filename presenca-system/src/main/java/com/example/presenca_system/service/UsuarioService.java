package com.example.presenca_system.service;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.model.dto.UsuarioTemplateDTO;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    // Métodos CRUD
    Usuario salvarUsuario(Usuario usuario);
    Optional<Usuario> buscarPorCpf(String cpf);
    List<Usuario> buscarTodos();
    void deletarUsuario(String cpf);

    // Métodos para listagem e validação
    List<UsuarioListDTO> listarUsuarios();
    List<UsuarioTemplateDTO> listarTemplatesParaValidacao();
    Optional<Usuario> validarBiometria(byte[] hashParaValidar);
}