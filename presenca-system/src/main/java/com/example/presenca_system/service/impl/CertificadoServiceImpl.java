package com.example.presenca_system.service.impl;

import com.example.presenca_system.service.PDFService;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.repository.UsuarioRepository;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CertificadoServiceImpl implements CertificadoService {

    @Autowired
    private CertificadoRepository certificadoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PDFService pdfService;

    @Override
    public void gerarCertificadosParaEvento(Evento evento) {
        // Implementação para gerar certificados para um evento
        // (sua implementação existente)
    }

    @Override
    public byte[] gerarCertificadoPDF(Certificado certificado) throws IOException, DocumentException {
        return pdfService.gerarCertificadoPDF(certificado);
    }

    @Override
    public byte[] gerarPDFConsolidadoPorEvento(Long eventoId) throws IOException, DocumentException {
        return pdfService.gerarPDFConsolidado(eventoId);
    }

    @Override
    public List<Certificado> buscarCertificadosPorCpf(String cpf) {
        return certificadoRepository.findByUsuarioCpf(cpf);
    }

    @Override
    public List<byte[]> gerarPDFsPorIds(List<Long> certificadoIds) throws IOException, DocumentException {
        List<Certificado> certificados = certificadoRepository.findByIds(certificadoIds);
        List<byte[]> pdfs = new ArrayList<>();
        
        for (Certificado certificado : certificados) {
            pdfs.add(gerarCertificadoPDF(certificado));
        }
        
        return pdfs;
    }

    @Override
    public String buscarEmailPorCpf(String cpf) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(cpf);
        if (usuarioOptional.isPresent()) {
            return usuarioOptional.get().getEmail();
        }
        throw new RuntimeException("Usuário não encontrado com CPF: " + cpf);
    }
}