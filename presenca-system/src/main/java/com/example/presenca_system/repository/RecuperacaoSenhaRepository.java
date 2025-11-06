package com.example.presenca_system.repository;

import com.example.presenca_system.model.RecuperacaoSenha;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecuperacaoSenhaRepository extends JpaRepository<RecuperacaoSenha, Long> {
    Optional<RecuperacaoSenha> findByTokenAndUtilizadoFalse(String token);
    Optional<RecuperacaoSenha> findByEmailAndUtilizadoFalse(String email);
}