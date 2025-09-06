package com.example.presenca_system.service;

import com.example.presenca_system.model.Superusuario;
import java.util.List;
import java.util.Optional;

public interface SuperusuarioService {

    Superusuario cadastrarSuperusuario(Superusuario superusuario);
    Optional<Superusuario> buscarPorEmail(String email);
    Superusuario alterarSuperusuario(String cpf, Superusuario superusuario);
    void excluirSuperusuario(String cpf);
    List<Superusuario> listarTodos();
    String login(String email, String senha);
}