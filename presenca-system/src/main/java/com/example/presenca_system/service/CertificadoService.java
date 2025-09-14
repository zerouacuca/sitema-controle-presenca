package com.example.presenca_system.service;

import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.repository.CertificadoRepository;
import com.example.presenca_system.repository.CheckInRepository;
import com.lowagie.text.DocumentException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CertificadoService {

    @Autowired
    private CheckInRepository checkInRepository;


    @Autowired
    private CertificadoRepository certificadoRepository;


    public void gerarCertificadosParaEvento(Evento evento) {
        List<CheckIn> checkIns = checkInRepository.findByEvento(evento);

        if (checkIns.isEmpty()) {
            return;
        }
        String nomeSuperusuario = evento.getSuperusuario().getUsuario().getNome();

        for (CheckIn checkIn : checkIns) {
            Usuario usuario = checkIn.getUsuario();

            Certificado novoCertificado = new Certificado();
            novoCertificado.setUsuario(usuario);
            novoCertificado.setEvento(evento);
            novoCertificado.setSuperusuario(evento.getSuperusuario());
            novoCertificado.setNomeUsuario(usuario.getNome());
            novoCertificado.setCpfUsuario(usuario.getCpf());
            novoCertificado.setNomeSuperusuario(nomeSuperusuario);
            novoCertificado.setDataEmissao(LocalDate.now());
            novoCertificado.setCodigoValidacao(UUID.randomUUID().toString());
            String textoCertificado = String.format(
                "Certificamos que %s, portador do CPF %s, participou do evento '%s' com carga horária de %.1f horas, realizado em %s. Certificado emitido por %s.",
                usuario.getNome(),
                usuario.getCpf(),
                evento.getTitulo(),
                evento.getCargaHoraria(),
                evento.getDataHora(),
                nomeSuperusuario
            );
            novoCertificado.setTexto(textoCertificado);

            certificadoRepository.save(novoCertificado);
        }
    }

    public byte[] gerarCertificadoPDF(Certificado certificado) throws IOException, DocumentException {
        // Mapeia os dados do objeto Certificado para o formato esperado pelo template
        Map<String, String> dados = new HashMap<>();
        dados.put("nomeUsuario", certificado.getNomeUsuario());
        dados.put("cpfUsuario", certificado.getCpfUsuario());
        dados.put("nomeEvento", certificado.getEvento().getTitulo());
        dados.put("cargaHoraria", String.valueOf(certificado.getEvento().getCargaHoraria()));
        dados.put("nomeSuperusuario", certificado.getNomeSuperusuario());
        dados.put("codigoValidacao", certificado.getCodigoValidacao());
        dados.put("dataEmissao", certificado.getDataEmissao().toString());
        dados.put("textoCertificado", certificado.getTexto());

        String htmlTemplate = lerTemplateHTML("certificado.html");
        String htmlPreenchido = preencherTemplate(htmlTemplate, dados);

        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlPreenchido);
            renderer.layout();
            renderer.createPDF(os);
            return os.toByteArray();
        }
    }

    private String lerTemplateHTML(String nomeArquivo) throws IOException {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("templates/" + nomeArquivo)) {
            if (inputStream == null) {
                throw new FileNotFoundException("Template não encontrado: " + nomeArquivo);
            }
            try (Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8)) {
                return new BufferedReader(reader)
                        .lines()
                        .collect(Collectors.joining("\n"));
            }
        }
    }

    private String preencherTemplate(String template, Map<String, String> dados) {
        String html = template;
        for (Map.Entry<String, String> entry : dados.entrySet()) {
            html = html.replace("${" + entry.getKey() + "}", entry.getValue());
        }
        return html;
    }
}