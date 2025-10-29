package com.example.presenca_system.service;

import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.dto.CertificadoDTO;
import com.lowagie.text.DocumentException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface CertificadoService {

    void gerarCertificadosParaEvento(Evento evento);

    byte[] gerarCertificadoPDF(Certificado certificado) throws IOException, DocumentException;

    byte[] gerarPDFConsolidadoPorEvento(Long eventoId) throws IOException, DocumentException;

    List<Certificado> buscarCertificadosPorMatricula(String matricula);

    List<byte[]> gerarPDFsPorIds(List<Long> certificadoIds) throws IOException, DocumentException;

    String buscarEmailPorMatricula(String matricula);

    List<CertificadoDTO> findAllDTO();

    List<CertificadoDTO> findByUsuarioMatriculaDTO(String matricula);

    List<CertificadoDTO> findByEventoEventoIdDTO(Long eventoId);

    Certificado save(Certificado certificado);

    Optional<Certificado> findById(Long id);

    List<Certificado> findAll();

    void deleteById(Long id);

    List<Certificado> findByEventoEventoId(Long eventoId);

    // Added the missing method declaration corresponding to the repository and implementation
    Optional<Certificado> findByUsuarioMatriculaAndEventoEventoId(String matricula, Long eventoId);

    boolean existsByUsuarioMatriculaAndEventoEventoId(String matricula, Long eventoId);

    List<CertificadoDTO> findBySuperusuarioEmailDTO(String emailSuperusuario);
    List<CertificadoDTO> findByEventoAndSuperusuarioEmailDTO(Long eventoId, String emailSuperusuario);
    Optional<Certificado> findByIdAndSuperusuarioEmail(Long id, String emailSuperusuario);
    boolean verificarPermissoesCertificados(List<Long> certificadoIds, String emailSuperusuario);
}