package com.example.presenca_system.model.dto;

import com.example.presenca_system.model.Certificado;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificadoDTO {
    private Long id;
    private String nomeUsuario;
    private String matriculaUsuario;
    private String nomeSuperusuario;
    private String codigoValidacao;
    private LocalDate dataEmissao;
    private String texto;
    private Long eventoId;
    private String eventoTitulo;
    private Double eventoCargaHoraria;

    public CertificadoDTO(Certificado certificado) {
        this.id = certificado.getId();
        this.nomeUsuario = certificado.getNomeUsuario();
        this.matriculaUsuario = certificado.getMatriculaUsuario();
        this.nomeSuperusuario = certificado.getNomeSuperusuario();
        this.codigoValidacao = certificado.getCodigoValidacao();
        this.dataEmissao = certificado.getDataEmissao();
        this.texto = certificado.getTexto();
        this.eventoId = certificado.getEvento().getEventoId();
        this.eventoTitulo = certificado.getTituloEvento();
        this.eventoCargaHoraria = certificado.getCargaHorariaEvento();
    }
}