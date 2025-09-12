package com.example.presenca_system.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "superusuarios")
public class Superusuario {

    @Id
    @Column(name = "cpf")
    private String cpf;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "senha", nullable = false)
    private String senha;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_cpf", referencedColumnName = "cpf")
    private Usuario usuario;
}