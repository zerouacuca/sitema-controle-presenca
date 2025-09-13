package com.example.presenca_system.controller;

import com.example.presenca_system.dto.UsuarioDTO;
import com.example.presenca_system.dto.UsuarioListDTO;
import com.example.presenca_system.dto.UsuarioTemplateDTO;
import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Base64;
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
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDto) {
        Usuario novoUsuario = new Usuario();
        novoUsuario.setCpf(usuarioDto.getCpf());
        novoUsuario.setNome(usuarioDto.getNome());
        novoUsuario.setMatricula(usuarioDto.getMatricula());
        novoUsuario.setSetor(usuarioDto.getSetor());
        //novoUsuario.setDataNascimento(usuarioDto.getDataNascimento());

        try {
            // Converte a string Base64 para um array de bytes
            byte[] biometriaBytes = Base64.getDecoder().decode(usuarioDto.getTemplate());
            novoUsuario.setTemplate(biometriaBytes);
        } catch (IllegalArgumentException e) {
            // Se a string Base64 for inválida, retorna erro
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Usuario usuarioSalvo = usuarioService.salvarUsuario(novoUsuario);
        return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
    }

    // Endpoint para listar todos os usuários (Operação READ)
    @GetMapping
    public ResponseEntity<List<UsuarioListDTO>> listarTodosOsUsuarios() {
        List<UsuarioListDTO> usuarios = usuarioService.listarUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Endpoint para listar apenas o CPF e o template
    @GetMapping("/templates")
    public ResponseEntity<List<UsuarioTemplateDTO>> listarTemplates() {
        List<UsuarioTemplateDTO> templates = usuarioService.listarTemplatesParaValidacao();
        return new ResponseEntity<>(templates, HttpStatus.OK);
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
            usuarioExistente.setDataNascimento(usuarioDetalhes.getDataNascimento());
            // Atenção: a biometria não é atualizada neste endpoint, pois você está passando um 'Usuario'
            Usuario usuarioAtualizado = usuarioService.salvarUsuario(usuarioExistente);

            // Para evitar erro de tipo, o DTO é o ideal para este endpoint também
            // Usuario usuarioAtualizado = usuarioService.salvarUsuario(usuarioExistente);
            // return new ResponseEntity<>(usuarioAtualizado, HttpStatus.OK);
            return new ResponseEntity<>(usuarioExistente, HttpStatus.OK);
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

    // Endpoint para buscar um usuário por CPF
    @GetMapping("/{cpf}")
    public ResponseEntity<Usuario> buscarPorCpf(@PathVariable String cpf) {
        Optional<Usuario> usuario = usuarioService.buscarPorCpf(cpf);
        return usuario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
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
