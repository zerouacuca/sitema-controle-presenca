package com.example.presenca_system.repository;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    Optional<CheckIn> findByUsuarioAndEvento(Usuario usuario, Evento evento);
    // Buscar todos os check-ins de um evento
    List<CheckIn> findByEvento(Evento evento);
}