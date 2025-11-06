package com.example.presenca_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "recuperacao_senha")
public class RecuperacaoSenha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private LocalDateTime dataExpiracao;

    @Column(nullable = false)
    private boolean utilizado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "superusuario_cpf")
    private Superusuario superusuario;
}