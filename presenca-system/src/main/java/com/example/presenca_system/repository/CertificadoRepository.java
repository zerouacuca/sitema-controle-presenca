// src/main/java/com/example/presenca_system/repository/CertificadoRepository.java
package com.example.presenca_system.repository;

import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.dto.CertificadoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificadoRepository extends JpaRepository<Certificado, Long> {

    List<Certificado> findByEventoEventoId(Long eventoId);
    Optional<Certificado> findByUsuarioCpfAndEventoEventoId(String usuarioCpf, Long eventoId);
    List<Certificado> findByUsuarioCpf(String cpf);
    
    @Query("SELECT c FROM Certificado c WHERE c.id IN :ids")
    List<Certificado> findByIds(@Param("ids") List<Long> ids);
    
    // Novos métodos para DTO
    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.nomeUsuario, c.cpfUsuario, c.nomeSuperusuario, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c")
    List<CertificadoDTO> findAllDTO();
    
    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.nomeUsuario, c.cpfUsuario, c.nomeSuperusuario, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c WHERE c.usuario.cpf = :cpf")
    List<CertificadoDTO> findByUsuarioCpfDTO(@Param("cpf") String cpf);
    
    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.nomeUsuario, c.cpfUsuario, c.nomeSuperusuario, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c WHERE c.evento.eventoId = :eventoId")
    List<CertificadoDTO> findByEventoEventoIdDTO(@Param("eventoId") Long eventoId);
}