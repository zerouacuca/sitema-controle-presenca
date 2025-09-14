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
    private String cpf;

    private String nome;

    private String matricula;

    private String setor;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "template")
    private byte[] template;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private Set<CheckIn> checkIns;
}