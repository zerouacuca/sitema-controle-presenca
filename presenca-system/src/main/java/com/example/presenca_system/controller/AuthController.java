package com.example.presenca_system.controller;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.repository.SuperusuarioRepository;
import com.example.presenca_system.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final SuperusuarioRepository superusuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(SuperusuarioRepository superusuarioRepository, 
                         PasswordEncoder passwordEncoder, 
                         JwtService jwtService) {
        this.superusuarioRepository = superusuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


     // ENDPOINT DE LOGIN

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Superusuario> superusuarioOptional = superusuarioRepository.findByEmail(loginRequest.getEmail());
        
        if (superusuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }

        Superusuario superusuario = superusuarioOptional.get();
        
        if (!passwordEncoder.matches(loginRequest.getSenha(), superusuario.getSenha())) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }

        String token = jwtService.generateToken(superusuario.getEmail());
        
        return ResponseEntity.ok(new AuthResponse(token, superusuario.getEmail()));
    }

    // ===== CLASSES DTO =====

    public static class LoginRequest {
        private String email;
        private String senha;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private String type = "Bearer";
        
        public AuthResponse(String token, String email) {
            this.token = token;
            this.email = email;
        }
        
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
}