package com.example.presenca_system.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
@Data
@NoArgsConstructor
@Table(name = "superusuarios")
@PrimaryKeyJoinColumn(name = "cpf")
public class Superusuario extends Usuario {

    @Column(name = "senha", nullable = false)
    private String senha;
}