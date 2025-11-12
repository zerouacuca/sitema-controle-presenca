package com.example.presenca_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- ADICIONE ESTA IMPORTAÇÃO
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Column(unique = true, nullable = false)
    private String matricula;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(nullable = false, unique = true)
    private String email;

    private String setor;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String template;
    
    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<CheckIn> checkIns;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<Certificado> certificados;
}