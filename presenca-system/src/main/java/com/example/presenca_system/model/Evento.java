package com.example.presenca_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

import com.example.presenca_system.model.enums.StatusEvento;

@Entity
@Data
public class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventoId;
    
    @Column(nullable = false)
    private String titulo;
    
    private String descricao;
    private Date dataHora;
    private double cargaHoraria;
    private String categoria;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "superusuario_matricula")
    private Superusuario superusuario;
    
    @Enumerated(EnumType.STRING)
    private StatusEvento status = StatusEvento.AGENDADO;

    @OneToMany(mappedBy = "evento", fetch = FetchType.LAZY)
    private List<CheckIn> checkIns;
}