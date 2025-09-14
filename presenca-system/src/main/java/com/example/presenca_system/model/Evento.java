package com.example.presenca_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.Set; // Importe a classe Set

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventoId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "superusuario_cpf", referencedColumnName = "cpf")
    private Superusuario superusuario;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "dataHora", nullable = false)
    private Date dataHora;

    @Column(name = "categoria", nullable = false)
    private String categoria;

    @Column(name = "cargaHoraria", nullable = false)
    private double cargaHoraria;

    @OneToMany(mappedBy = "evento", cascade = CascadeType.ALL)
    private Set<CheckIn> checkIns;
}