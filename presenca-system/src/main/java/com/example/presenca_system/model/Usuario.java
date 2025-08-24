package com.example.presenca_system.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Column(name = "cpf", nullable = false)
    private String cpf;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "matricula", nullable = false)
    private String matricula;

    @Column(name = "setor")
    private String setor;

    @Lob
    @Column(name = "hash_biometria", nullable = false)
    private byte[] hashBiometria;

}