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
    
    Superusuario criarPrimeiroSuperusuario(Superusuario superusuario);
    boolean existeAlgumSuperusuario();
    
    
    // 🔐 NOVOS MÉTODOS PARA VALIDAÇÃO DE PERMISSÕES
    Superusuario cadastrarSuperusuario(Superusuario superusuario, String emailSuperusuarioAutenticado);
    Superusuario alterarSuperusuario(String cpf, Superusuario superusuario, String emailSuperusuarioAutenticado);
    void excluirSuperusuario(String cpf, String emailSuperusuarioAutenticado);
    List<Superusuario> listarTodos(String emailSuperusuarioAutenticado);
}