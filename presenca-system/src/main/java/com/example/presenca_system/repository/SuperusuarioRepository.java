package com.example.presenca_system.repository;

import com.example.presenca_system.model.Superusuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SuperusuarioRepository extends JpaRepository<Superusuario, String> {

    Optional<Superusuario> findByEmail(String email);
}