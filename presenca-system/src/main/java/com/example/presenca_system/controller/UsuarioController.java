package com.example.presenca_system.controller;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Endpoint para criar um novo usuário (Operação CREATE)
    @PostMapping
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.salvarUsuario(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // Endpoint para buscar todos os usuários (Operação READ)
    @GetMapping
    public ResponseEntity<List<Usuario>> buscarTodos() {
        List<Usuario> usuarios = usuarioService.buscarTodos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Endpoint para buscar um usuário por CPF (Operação READ)
    @GetMapping("/{cpf}")
    public ResponseEntity<Usuario> buscarPorCpf(@PathVariable String cpf) {
        Optional<Usuario> usuario = usuarioService.buscarPorCpf(cpf);
        return usuario.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para atualizar um usuário (Operação UPDATE)
    @PutMapping("/{cpf}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable String cpf, @RequestBody Usuario usuarioDetalhes) {
        Optional<Usuario> usuario = usuarioService.buscarPorCpf(cpf);
        if (usuario.isPresent()) {
            Usuario usuarioExistente = usuario.get();
            usuarioExistente.setNome(usuarioDetalhes.getNome());
            usuarioExistente.setMatricula(usuarioDetalhes.getMatricula());
            usuarioExistente.setSetor(usuarioDetalhes.getSetor());
            
            // Note: A biometria não é atualizada aqui, é um processo separado
            Usuario usuarioAtualizado = usuarioService.salvarUsuario(usuarioExistente);
            return new ResponseEntity<>(usuarioAtualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint para deletar um usuário (Operação DELETE)
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable String cpf) {
        usuarioService.deletarUsuario(cpf);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Endpoint para validar a biometria para o check-in
    @PostMapping("/validar-biometria")
    public ResponseEntity<Usuario> validarBiometria(@RequestBody byte[] hashBiometrico) {
        Optional<Usuario> usuario = usuarioService.validarBiometria(hashBiometrico);

        if (usuario.isPresent()) {
            // Lógica para registrar a presença (ex: salvar em outra tabela de presença)
            // ...
            return new ResponseEntity<>(usuario.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}