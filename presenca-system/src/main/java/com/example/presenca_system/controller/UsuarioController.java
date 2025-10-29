package com.example.presenca_system.controller;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioDTO;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDto) {
        try {
            Usuario usuarioSalvo = usuarioService.cadastrarNovoUsuario(usuarioDto);
            return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) { // <-- Específico (vem primeiro)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) { // <-- Geral (vem por último)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PutMapping("/{matricula}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable String matricula, @RequestBody UsuarioDTO usuarioDto) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizarUsuarioExistente(matricula, usuarioDto);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (IllegalArgumentException e) { // <-- Erro específico (Base64) vem PRIMEIRO
            return ResponseEntity.badRequest().body("Template biométrico inválido.");
        } catch (RuntimeException e) { // <-- Erro geral (Regra de negócio) vem DEPOIS
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UsuarioListDTO>> listarTodosOsUsuarios() {
        List<UsuarioListDTO> usuarios = usuarioService.listarUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/{matricula}")
    public ResponseEntity<Usuario> buscarPorMatricula(@PathVariable String matricula) {
        return usuarioService.buscarPorMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{matricula}")
    public ResponseEntity<?> deletarUsuario(@PathVariable String matricula) {
        try {
            usuarioService.deletarUsuario(matricula);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}