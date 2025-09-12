package com.example.presenca_system.controller;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.service.SuperusuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/superusuarios")
public class SuperusuarioController {

    private final SuperusuarioService superusuarioService;

    public SuperusuarioController(SuperusuarioService superusuarioService) {
        this.superusuarioService = superusuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Superusuario loginRequest) {
        try {
            String token = superusuarioService.login(loginRequest.getEmail(), loginRequest.getSenha());
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Superusuario> cadastrarSuperusuario(@RequestBody Superusuario superusuario) {
        Superusuario novoSuperusuario = superusuarioService.cadastrarSuperusuario(superusuario);
        return ResponseEntity.ok(novoSuperusuario);
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<Superusuario> alterarSuperusuario(@PathVariable String cpf, @RequestBody Superusuario superusuario) {
        try {
            Superusuario superusuarioAtualizado = superusuarioService.alterarSuperusuario(cpf, superusuario);
            return ResponseEntity.ok(superusuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> excluirSuperusuario(@PathVariable String cpf) {
        superusuarioService.excluirSuperusuario(cpf);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{email}")
    public ResponseEntity<Superusuario> buscarPorEmail(@PathVariable String email) {
        return superusuarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Superusuario>> listarTodos() {
        List<Superusuario> superusuarios = superusuarioService.listarTodos();
        return ResponseEntity.ok(superusuarios);
    }
}