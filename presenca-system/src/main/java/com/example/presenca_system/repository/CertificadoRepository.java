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
    Optional<Certificado> findByUsuarioMatriculaAndEventoEventoId(String usuarioMatricula, Long eventoId);
    List<Certificado> findByUsuarioMatricula(String matricula);

    @Query("SELECT c FROM Certificado c WHERE c.superusuario.email = :emailSuperusuario")
    List<Certificado> findBySuperusuarioEmail(@Param("emailSuperusuario") String emailSuperusuario);

    @Query("SELECT c FROM Certificado c WHERE c.id = :id AND c.superusuario.email = :emailSuperusuario")
    Optional<Certificado> findByIdAndSuperusuarioEmail(@Param("id") Long id,
                                                      @Param("emailSuperusuario") String emailSuperusuario);

    @Query("SELECT c FROM Certificado c WHERE c.evento.eventoId = :eventoId AND c.superusuario.email = :emailSuperusuario")
    List<Certificado> findByEventoAndSuperusuarioEmail(@Param("eventoId") Long eventoId,
                                                      @Param("emailSuperusuario") String emailSuperusuario);

    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.usuario.nome, c.usuario.matricula, c.superusuario.nome, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c")
    List<CertificadoDTO> findAllDTO();

    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.usuario.nome, c.usuario.matricula, c.superusuario.nome, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c WHERE c.usuario.matricula = :matricula")
    List<CertificadoDTO> findByUsuarioMatriculaDTO(@Param("matricula") String matricula);

    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.usuario.nome, c.usuario.matricula, c.superusuario.nome, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c WHERE c.evento.eventoId = :eventoId")
    List<CertificadoDTO> findByEventoEventoIdDTO(@Param("eventoId") Long eventoId);

    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.usuario.nome, c.usuario.matricula, c.superusuario.nome, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c WHERE c.superusuario.email = :emailSuperusuario")
    List<CertificadoDTO> findBySuperusuarioEmailDTO(@Param("emailSuperusuario") String emailSuperusuario);

    @Query("SELECT new com.example.presenca_system.model.dto.CertificadoDTO(" +
           "c.id, c.usuario.nome, c.usuario.matricula, c.superusuario.nome, " +
           "c.codigoValidacao, c.dataEmissao, c.texto, " +
           "c.evento.eventoId, c.evento.titulo, c.evento.cargaHoraria) " +
           "FROM Certificado c WHERE c.evento.eventoId = :eventoId AND c.superusuario.email = :emailSuperusuario")
    List<CertificadoDTO> findByEventoAndSuperusuarioEmailDTO(@Param("eventoId") Long eventoId,
                                                            @Param("emailSuperusuario") String emailSuperusuario);
}