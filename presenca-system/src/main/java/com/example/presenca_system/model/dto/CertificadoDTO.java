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
    private String cpfUsuario;
    private String nomeSuperusuario;
    private String codigoValidacao;
    private LocalDate dataEmissao;
    private String texto;
    private Long eventoId;
    private String eventoTitulo;
    private Double eventoCargaHoraria;

    // 🔥 CONSTRUTOR QUE RECEBE CERTIFICADO (usando métodos de conveniência)
    public CertificadoDTO(Certificado certificado) {
        this.id = certificado.getId();
        this.nomeUsuario = certificado.getNomeUsuario();           // Método automático
        this.cpfUsuario = certificado.getCpfUsuario();             // Método automático
        this.nomeSuperusuario = certificado.getNomeSuperusuario(); // Método automático
        this.codigoValidacao = certificado.getCodigoValidacao();
        this.dataEmissao = certificado.getDataEmissao();
        this.texto = certificado.getTexto();
        this.eventoId = certificado.getEvento().getEventoId();
        this.eventoTitulo = certificado.getTituloEvento();         // Método automático
        this.eventoCargaHoraria = certificado.getCargaHorariaEvento(); // Método automático
    }
}