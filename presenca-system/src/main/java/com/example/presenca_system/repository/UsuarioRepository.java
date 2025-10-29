package com.example.presenca_system.repository;

import com.example.presenca_system.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    Optional<Usuario> findByTemplate(byte[] templateBiometrico);

    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional<Usuario> findByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.matricula = :matricula")
    boolean existsByMatricula(@Param("matricula") String matricula);

    @Query("SELECT DISTINCT ci.usuario FROM CheckIn ci WHERE ci.evento.superusuario.email = :emailSuperusuario")
    List<Usuario> findUsuariosComCheckInPorSuperusuario(@Param("emailSuperusuario") String emailSuperusuario);

    List<Usuario> findBySetor(String setor);
}