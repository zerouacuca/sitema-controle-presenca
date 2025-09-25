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

    // 🔐 Todos os endpoints exigem autenticação de superusuário
    @PostMapping
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody UsuarioDTO usuarioDto, Authentication authentication) {
        // Apenas valida que está autenticado
        String emailSuperusuario = authentication.getName();
        
        Usuario novoUsuario = new Usuario();
        novoUsuario.setCpf(usuarioDto.getCpf());
        novoUsuario.setNome(usuarioDto.getNome());
        novoUsuario.setMatricula(usuarioDto.getMatricula());
        novoUsuario.setSetor(usuarioDto.getSetor());

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

}