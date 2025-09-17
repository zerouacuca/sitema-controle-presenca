package com.example.presenca_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario {

    @Id
    @Column(name = "cpf", nullable = false, unique = true)
    private String cpf;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "matricula", nullable = false, unique = true)
    private String matricula;

    @Column(name = "setor", nullable = false)
    private String setor;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "template")
    private byte[] template;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Set<CheckIn> checkIns;
}