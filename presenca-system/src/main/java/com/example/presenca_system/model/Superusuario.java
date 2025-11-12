package com.example.presenca_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "superusuarios")
public class Superusuario {
    
    @Id
    private String matricula; 
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String senha;
    
    @JsonIgnore
    @OneToMany(mappedBy = "superusuario")
    private List<Evento> eventosCriados;
}