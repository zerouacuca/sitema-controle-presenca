package com.example.presenca_system.controller;

import com.example.presenca_system.model.Usuario;
import com.example.presenca_system.model.dto.UsuarioDTO;
import com.example.presenca_system.model.dto.UsuarioListDTO;
import com.example.presenca_system.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/admin/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDto, Authentication authentication) {
        String emailSuperusuario = authentication.getName();

        Usuario novoUsuario = new Usuario();
        novoUsuario.setCpf(usuarioDto.getCpf());
        novoUsuario.setNome(usuarioDto.getNome());
        novoUsuario.setMatricula(usuarioDto.getMatricula());
        novoUsuario.setSetor(usuarioDto.getSetor());
        novoUsuario.setDataNascimento(usuarioDto.getDataNascimento() != null ?
                usuarioDto.getDataNascimento().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate() : null);


        try {
            byte[] biometriaBytes = Base64.getDecoder().decode(usuarioDto.getTemplate());
            novoUsuario.setTemplate(biometriaBytes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        Usuario usuarioSalvo = usuarioService.salvarUsuario(novoUsuario);
        return new ResponseEntity<>(usuarioSalvo, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioListDTO>> listarTodosOsUsuarios(Authentication authentication) {
        String emailSuperusuario = authentication.getName();
        List<UsuarioListDTO> usuarios = usuarioService.listarUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<Usuario> buscarPorCpf(@PathVariable String cpf, Authentication authentication) {
         String emailSuperusuario = authentication.getName(); // Valida autenticação
         return usuarioService.buscarPorCpf(cpf)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }

     @PutMapping("/{cpf}")
     public ResponseEntity<Usuario> atualizarUsuario(@PathVariable String cpf, @RequestBody UsuarioDTO usuarioDto, Authentication authentication) {
         String emailSuperusuario = authentication.getName(); // Valida autenticação

         return usuarioService.buscarPorCpf(cpf)
             .map(usuarioExistente -> {
                 usuarioExistente.setNome(usuarioDto.getNome());
                 usuarioExistente.setMatricula(usuarioDto.getMatricula());
                 usuarioExistente.setSetor(usuarioDto.getSetor());
                 usuarioExistente.setDataNascimento(usuarioDto.getDataNascimento() != null ?
                         usuarioDto.getDataNascimento().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate() : null);


                 // Atualiza biometria apenas se um novo template for fornecido
                 if (usuarioDto.getTemplate() != null && !usuarioDto.getTemplate().isEmpty()) {
                     try {
                         byte[] biometriaBytes = Base64.getDecoder().decode(usuarioDto.getTemplate());
                         usuarioExistente.setTemplate(biometriaBytes);
                     } catch (IllegalArgumentException e) {
                         // Considerar logar o erro ou retornar BadRequest
                         // Por enquanto, apenas ignora a atualização da biometria se inválida
                     }
                 }

                 Usuario usuarioAtualizado = usuarioService.salvarUsuario(usuarioExistente);
                 return ResponseEntity.ok(usuarioAtualizado);
             })
             .orElse(ResponseEntity.notFound().build());
     }


    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable String cpf, Authentication authentication) {
        try {
            usuarioService.deletarUsuario(cpf);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}