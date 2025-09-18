package com.example.presenca_system.repository;

import com.example.presenca_system.model.Certificado;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificadoRepository extends JpaRepository<Certificado, Long> {

    List<Certificado> findByEventoEventoId(Long eventoId);
    Optional<Certificado> findByUsuarioCpfAndEventoEventoId(String usuarioCpf, Long eventoId);
    List<Certificado> findByUsuarioCpf(String cpf);
    @Query("SELECT c FROM Certificado c WHERE c.id IN :ids")
    List<Certificado> findByIds(@Param("ids") List<Long> ids);
}