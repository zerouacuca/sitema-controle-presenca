package com.example.presenca_system.repository;

import com.example.presenca_system.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    // 🔐 NOVOS MÉTODOS PARA VALIDAÇÃO POR SUPERUSUÁRIO
    @Query("SELECT e FROM Evento e WHERE e.superusuario.email = :emailSuperusuario")
    List<Evento> findBySuperusuarioEmail(@Param("emailSuperusuario") String emailSuperusuario);

    @Query("SELECT e FROM Evento e WHERE e.eventoId = :id AND e.superusuario.email = :emailSuperusuario")
    Optional<Evento> findByIdAndSuperusuarioEmail(@Param("id") Long id, 
                                                 @Param("emailSuperusuario") String emailSuperusuario);

    // Método para buscar eventos com status específico por superusuário
    @Query("SELECT e FROM Evento e WHERE e.superusuario.email = :emailSuperusuario AND e.status = :status")
    List<Evento> findBySuperusuarioEmailAndStatus(@Param("emailSuperusuario") String emailSuperusuario, 
                                                 @Param("status") String status);

    @Query("SELECT COUNT(e) > 0 FROM Evento e WHERE e.titulo = :titulo")
    boolean existsByTitulo(@Param("titulo") String titulo);
}