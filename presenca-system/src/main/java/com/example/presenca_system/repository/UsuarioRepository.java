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
    
    // MÉTODO EXISTENTE
    Optional<Usuario> findByTemplate(byte[] templateBiometrico);

    // 🔐 NOVOS MÉTODOS ÚTEIS
    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional<Usuario> findByEmail(@Param("email") String email);

    @Query("SELECT u FROM Usuario u WHERE u.matricula = :matricula")
    Optional<Usuario> findByMatricula(@Param("matricula") String matricula);

    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.matricula = :matricula")
    boolean existsByMatricula(@Param("matricula") String matricula);

    // Método para buscar usuários com check-ins em eventos de um superusuário específico
    @Query("SELECT DISTINCT ci.usuario FROM CheckIn ci WHERE ci.evento.superusuario.email = :emailSuperusuario")
    List<Usuario> findUsuariosComCheckInPorSuperusuario(@Param("emailSuperusuario") String emailSuperusuario);

    // Método para buscar usuários por setor
    List<Usuario> findBySetor(String setor);
}