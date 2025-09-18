// src/main/java/com/example/presenca_system/service/CertificadoService.java
package com.example.presenca_system.service;

import com.example.presenca_system.model.Certificado;
import com.example.presenca_system.model.Evento;
import com.lowagie.text.DocumentException;
import java.io.IOException;
import java.util.List;

public interface CertificadoService {

    /**
     * Gera certificados para todos os participantes de um evento que
     * tenham o status de check-in igual a PRESENTE.
     * A função busca todos os check-ins de um evento, itera sobre eles e,
     * para cada check-in com status "PRESENTE", cria uma nova entidade Certificado.
     * Os dados são populados a partir das entidades relacionadas (Usuário, Evento, Superusuario)
     * e um código de validação único é gerado. A entidade Certificado é então
     * persistida no banco de dados.
     *
     * @param evento A entidade Evento para a qual os certificados serão gerados.
     */
    void gerarCertificadosParaEvento(Evento evento);

    /**
     * Gera um único arquivo PDF para um certificado específico.
     * A função recebe uma entidade Certificado, extrai seus dados e os mapeia para um
     * HashMap. Em seguida, lê um template HTML, substitui as variáveis de placeholder
     * pelos dados do certificado e, finalmente, utiliza a biblioteca Flying Saucer
     * para renderizar o HTML preenchido em um documento PDF. O resultado é retornado
     * como um array de bytes.
     *
     * @param certificado A entidade Certificado contendo os dados a serem impressos no PDF.
     * @return Um array de bytes representando o arquivo PDF gerado.
     * @throws IOException Se houver um erro de leitura do template HTML.
     * @throws DocumentException Se houver um erro na criação do documento PDF.
     */
    byte[] gerarCertificadoPDF(Certificado certificado) throws IOException, DocumentException;
    
    /**
     * Gera um único arquivo PDF consolidado com todos os certificados de um evento.
     * A função busca todos os certificados associados a um evento no banco de dados.
     * Em seguida, utiliza um loop para gerar o PDF de cada certificado individualmente
     * e os anexa a um único documento PDF, combinando-os em uma única saída.
     * Retorna um array de bytes com o documento consolidado.
     *
     * @param eventoId O ID do evento cujos certificados serão consolidados.
     * @return Um array de bytes do arquivo PDF consolidado.
     * @throws IOException Se houver um erro de leitura/escrita de arquivos.
     * @throws DocumentException Se houver um erro na criação do documento PDF.
     */
    byte[] gerarPDFConsolidadoPorEvento(Long eventoId) throws IOException, DocumentException;

    /**
     * Busca todos os certificados de um usuário pelo CPF.
     *
     * @param cpf CPF do usuário
     * @return Lista de certificados do usuário
     */
    List<Certificado> buscarCertificadosPorCpf(String cpf);

    /**
     * Gera PDFs para uma lista de certificados por seus IDs.
     *
     * @param certificadoIds Lista de IDs dos certificados
     * @return Lista de arrays de bytes representando os PDFs gerados
     * @throws IOException Se houver erro de leitura/escrita
     * @throws DocumentException Se houver erro na criação do PDF
     */
    List<byte[]> gerarPDFsPorIds(List<Long> certificadoIds) throws IOException, DocumentException;

    /**
     * Busca o email de um usuário pelo CPF.
     *
     * @param cpf CPF do usuário
     * @return Email do usuário
     */
    String buscarEmailPorCpf(String cpf);
}