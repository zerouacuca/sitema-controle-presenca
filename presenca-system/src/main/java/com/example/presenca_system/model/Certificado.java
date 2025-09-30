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

    // Relacionamento com o Usuário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_cpf", nullable = false)
    private Usuario usuario;

    // Relacionamento com o Evento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    // Relacionamento com o Superusuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "superusuario_cpf", nullable = false)
    private Superusuario superusuario;

    @Column(name = "codigo_validacao", unique = true, nullable = false)
    private String codigoValidacao;

    @Column(name = "data_emissao", nullable = false)
    private LocalDate dataEmissao;

    @Column(name = "texto_certificado", columnDefinition = "TEXT")
    private String texto;

    // 🔥 MÉTODOS CONVENIENCIA - NÃO SÃO GETTERS/SETTERS, SÃO MÉTODOS DE CONSULTA
    public String getNomeUsuario() {
        return this.usuario != null ? this.usuario.getNome() : "";
    }

    public String getCpfUsuario() {
        return this.usuario != null ? this.usuario.getCpf() : "";
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