package com.example.presenca_system.repository;

import com.example.presenca_system.model.Usuario;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    Optional<Usuario> findByTemplate(byte[] templateBiometrico);
}