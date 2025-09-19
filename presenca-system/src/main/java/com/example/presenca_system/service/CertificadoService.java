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
    
    List<Certificado> buscarCertificadosPorCpf(String cpf);
    
    List<byte[]> gerarPDFsPorIds(List<Long> certificadoIds) throws IOException, DocumentException;
    
    String buscarEmailPorCpf(String cpf);
    
    // Novos métodos para DTO
    List<CertificadoDTO> findAllDTO();
    
    List<CertificadoDTO> findByUsuarioCpfDTO(String cpf);
    
    List<CertificadoDTO> findByEventoEventoIdDTO(Long eventoId);
    
    // Métodos CRUD básicos
    Certificado save(Certificado certificado);
    
    Optional<Certificado> findById(Long id);
    
    List<Certificado> findAll();
    
    void deleteById(Long id);
    
    List<Certificado> findByEventoEventoId(Long eventoId);
    
    Optional<Certificado> findByUsuarioCpfAndEventoEventoId(String cpf, Long eventoId);
    
    // Métodos adicionais
    boolean existsByUsuarioCpfAndEventoEventoId(String cpf, Long eventoId);
}