package com.example.presenca_system.repository;

import com.example.presenca_system.model.Superusuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperusuarioRepository extends JpaRepository<Superusuario, String> {
    
    Optional<Superusuario> findByEmail(String email);

    //   NOVO MÉTODO PARA VERIFICAÇÃO DE EXISTÊNCIA
    @Query("SELECT COUNT(s) > 0 FROM Superusuario s WHERE s.email = :email")
    boolean existsByEmail(@Param("email") String email);

    // Método para buscar superusuário com eventos (carregamento eager opcional)
    @Query("SELECT s FROM Superusuario s LEFT JOIN FETCH s.eventosCriados WHERE s.email = :email")
    Optional<Superusuario> findByEmailWithEventos(@Param("email") String email);
}