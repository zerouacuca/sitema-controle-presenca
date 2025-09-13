package com.example.presenca_system.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;


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

    // A coluna 'hash_biometria' no banco de dados é do tipo 'bytea'.
    // O tipo 'bytea' no PostgreSQL é mapeado para um array de bytes 'byte[]' no Java.
    // O erro 'bigint' ocorre porque o seu código estava tentando inserir um número.
    // Corrigimos isso mudando o tipo de dado para 'byte[]' para armazenar os dados binários.
    @Column(name = "hash_biometria")
    private byte[] hashBiometria;

}
