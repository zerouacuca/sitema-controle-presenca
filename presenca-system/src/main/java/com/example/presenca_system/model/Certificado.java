package com.example.presenca_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "certificados")
public class Certificado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_matricula", referencedColumnName = "matricula", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "superusuario_matricula", nullable = false)
    private Superusuario superusuario;

    @Column(name = "codigo_validacao", unique = true, nullable = false)
    private String codigoValidacao;

    @Column(name = "data_emissao", nullable = false)
    private LocalDate dataEmissao;

    @Column(name = "texto_certificado", columnDefinition = "TEXT")
    private String texto;

    public String getNomeUsuario() {
        return this.usuario != null ? this.usuario.getNome() : "";
    }

    public String getMatriculaUsuario() {
        return this.usuario != null ? this.usuario.getMatricula() : "";
    }


    public String getNomeSuperusuario() {
        return this.superusuario != null ? this.superusuario.getNome() : "";
    }

    public String getTituloEvento() {
        return this.evento != null ? this.evento.getTitulo() : "";
    }

    public Double getCargaHorariaEvento() {
        return this.evento != null ? this.evento.getCargaHoraria() : 0.0;
    }
}