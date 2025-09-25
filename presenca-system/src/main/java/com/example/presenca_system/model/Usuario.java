package com.example.presenca_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    private String cpf;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(nullable = false, unique = true)
    private String email;
    private String matricula;
    private String setor;
    
    @Column(nullable = false)
    private byte[] template;
    
    @OneToMany(mappedBy = "usuario")
    private List<CheckIn> checkIns;
}