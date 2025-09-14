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
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    // Relacionamento com o Superusuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "superusuario_cpf", nullable = false)
    private Superusuario superusuario;

    // Dados do Certificado
    @Column(name = "nome_usuario", nullable = false)
    private String nomeUsuario;

    @Column(name = "cpf_usuario", nullable = false)
    private String cpfUsuario;

    @Column(name = "nome_superusuario", nullable = false)
    private String nomeSuperusuario;

    @Column(name = "codigo_validacao", unique = true, nullable = false)
    private String codigoValidacao;

    @Column(name = "data_emissao", nullable = false)
    private LocalDate dataEmissao;

    @Lob // Para textos longos
    @Column(name = "texto_certificado", nullable = false)
    private String texto;
}