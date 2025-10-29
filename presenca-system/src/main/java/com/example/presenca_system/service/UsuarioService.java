package com.example.presenca_system.service;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioDTO;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.model.dto.UsuarioTemplateDTO;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    Usuario salvarUsuario(Usuario usuario);
    Optional<Usuario> buscarPorMatricula(String matricula);
    List<Usuario> buscarTodos();
    void deletarUsuario(String matricula);
    List<UsuarioListDTO> listarUsuarios();
    List<UsuarioTemplateDTO> listarTemplatesParaValidacao();
    Optional<Usuario> validarBiometria(byte[] hashParaValidar);
    Usuario cadastrarNovoUsuario(UsuarioDTO usuarioDto);
    Usuario atualizarUsuarioExistente(String matricula, UsuarioDTO usuarioDto);
}