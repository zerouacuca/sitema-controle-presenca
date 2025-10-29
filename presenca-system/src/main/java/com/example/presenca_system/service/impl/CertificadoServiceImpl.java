package com.example.presenca_system.service.impl;

import com.example.presenca_system.service.PDFService;
import com.example.presenca_system.service.CertificadoService;
import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.model.dto.CertificadoDTO;
import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.repository.UsuarioRepository;
import com.lowagie.text.DocumentException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CertificadoServiceImpl implements CertificadoService {

    @Autowired
    private CertificadoRepository certificadoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PDFService pdfService;

    @Override
    @Transactional(readOnly = true)
    public List<CertificadoDTO> findBySuperusuarioEmailDTO(String emailSuperusuario) {
        return certificadoRepository.findBySuperusuarioEmailDTO(emailSuperusuario);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificadoDTO> findByEventoAndSuperusuarioEmailDTO(Long eventoId, String emailSuperusuario) {
        return certificadoRepository.findByEventoAndSuperusuarioEmailDTO(eventoId, emailSuperusuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Certificado> findByIdAndSuperusuarioEmail(Long id, String emailSuperusuario) {
        return certificadoRepository.findByIdAndSuperusuarioEmail(id, emailSuperusuario);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verificarPermissoesCertificados(List<Long> certificadoIds, String emailSuperusuario) {
        for (Long certificadoId : certificadoIds) {
            Optional<Certificado> certificado = certificadoRepository.findByIdAndSuperusuarioEmail(certificadoId, emailSuperusuario);
            if (certificado.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void gerarCertificadosParaEvento(Evento evento) {
        System.out.println("Método gerarCertificadosParaEvento precisa ser implementado");
    }

    private String generateValidationCode() {
        return "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
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
    public List<Certificado> buscarCertificadosPorMatricula(String matricula) {
        return certificadoRepository.findByUsuarioMatricula(matricula);
    }


    @Override
    public List<byte[]> gerarPDFsPorIds(List<Long> certificadoIds) throws IOException, DocumentException {
        List<Certificado> certificados = certificadoRepository.findAllById(certificadoIds);
        List<byte[]> pdfs = new ArrayList<>();

        for (Certificado certificado : certificados) {
            pdfs.add(gerarCertificadoPDF(certificado));
        }

        return pdfs;
    }

    @Override
    public String buscarEmailPorMatricula(String matricula) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(matricula);
        if (usuarioOptional.isPresent()) {
            return usuarioOptional.get().getEmail();
        }
        throw new RuntimeException("Usuário não encontrado com Matrícula: " + matricula);
    }


    @Override
    @Transactional(readOnly = true)
    public List<CertificadoDTO> findAllDTO() {
        return certificadoRepository.findAllDTO();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificadoDTO> findByUsuarioMatriculaDTO(String matricula) {
        return certificadoRepository.findByUsuarioMatriculaDTO(matricula);
    }


    @Override
    @Transactional(readOnly = true)
    public List<CertificadoDTO> findByEventoEventoIdDTO(Long eventoId) {
        return certificadoRepository.findByEventoEventoIdDTO(eventoId);
    }

    @Override
    public Certificado save(Certificado certificado) {
        return certificadoRepository.save(certificado);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Certificado> findById(Long id) {
        return certificadoRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Certificado> findAll() {
        return certificadoRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        certificadoRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Certificado> findByEventoEventoId(Long eventoId) {
        return certificadoRepository.findByEventoEventoId(eventoId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Certificado> findByUsuarioMatriculaAndEventoEventoId(String matricula, Long eventoId) {
        return certificadoRepository.findByUsuarioMatriculaAndEventoEventoId(matricula, eventoId);
    }


    @Override
    @Transactional(readOnly = true)
    public boolean existsByUsuarioMatriculaAndEventoEventoId(String matricula, Long eventoId) {
        return certificadoRepository.findByUsuarioMatriculaAndEventoEventoId(matricula, eventoId).isPresent();
    }


    public Certificado criarCertificado(Usuario usuario, Evento evento, Superusuario superusuario) {
        Certificado certificado = new Certificado();
        certificado.setUsuario(usuario);
        certificado.setEvento(evento);
        certificado.setSuperusuario(superusuario);
        certificado.setCodigoValidacao(generateValidationCode());
        certificado.setDataEmissao(LocalDate.now());

        certificado.setTexto("Certificado de participação no evento \"" + evento.getTitulo() +
                        "\" com carga horária de " + evento.getCargaHoraria() + " horas. " +
                        "Emitido por " + superusuario.getNome() + ".");

        return certificadoRepository.save(certificado);
    }
}