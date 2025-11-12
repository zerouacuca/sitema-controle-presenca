package com.example.presenca_system.controller;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.service.SuperusuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/superusuarios")
public class SuperusuarioController {

    private final SuperusuarioService superusuarioService;

    public SuperusuarioController(SuperusuarioService superusuarioService) {
        this.superusuarioService = superusuarioService;
    }

    //   Criar novo superusuário (apenas para superusuários autenticados)
    @PostMapping
    public ResponseEntity<Superusuario> cadastrarSuperusuario(@RequestBody Superusuario superusuario, Authentication authentication) {
        String emailAutenticado = authentication.getName();
        Superusuario novoSuperusuario = superusuarioService.cadastrarSuperusuario(superusuario, emailAutenticado);
        return ResponseEntity.ok(novoSuperusuario);
    }

    //   Listar todos superusuários
    @GetMapping
    public ResponseEntity<List<Superusuario>> listarTodos(Authentication authentication) {
        String emailAutenticado = authentication.getName();
        List<Superusuario> superusuarios = superusuarioService.listarTodos(emailAutenticado);
        return ResponseEntity.ok(superusuarios);
    }

    //   Buscar perfil do usuário logado
    @GetMapping("/perfil")
    public ResponseEntity<Superusuario> getMeuPerfil(Authentication authentication) {
        String email = authentication.getName();
        return superusuarioService.buscarPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //   Buscar superusuário por matrícula (para edição)
    @GetMapping("/{matricula}")
    public ResponseEntity<Superusuario> getSuperusuarioPorMatricula(@PathVariable String matricula, Authentication authentication) {
        return superusuarioService.buscarPorMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //   Atualizar superusuário
    @PutMapping("/{matricula}")
    public ResponseEntity<Superusuario> alterarSuperusuario(@PathVariable String matricula, @RequestBody Superusuario superusuario, Authentication authentication) {
        try {
            String emailAutenticado = authentication.getName();
            Superusuario superusuarioAtualizado = superusuarioService.alterarSuperusuario(matricula, superusuario, emailAutenticado);
            return ResponseEntity.ok(superusuarioAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //   Excluir superusuário
    @DeleteMapping("/{matricula}")
    public ResponseEntity<Void> excluirSuperusuario(@PathVariable String matricula, Authentication authentication) {
        String emailAutenticado = authentication.getName();
        superusuarioService.excluirSuperusuario(matricula, emailAutenticado);
        return ResponseEntity.noContent().build();
    }
}