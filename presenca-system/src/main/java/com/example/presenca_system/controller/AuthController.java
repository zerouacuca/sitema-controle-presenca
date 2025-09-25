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
        
        // Opcional: Criar admin automaticamente ao iniciar (descomente se quiser)
        // this.criarAdminSeNaoExistir();
    }

    /**
     * 🔓 ENDPOINT DE SETUP PARA TESTES
     * Cria um usuário admin padrão para desenvolvimento
     * URL: GET /auth/setup-admin
     */
    @GetMapping("/setup-admin")
    public ResponseEntity<?> setupAdmin() {
        try {
            // Verificar se o admin já existe
            Optional<Superusuario> adminExistente = superusuarioRepository.findByEmail("admin@admin.com");
            if (adminExistente.isPresent()) {
                return ResponseEntity.ok(
                    new SetupResponse("⚠️ Admin já existe", 
                                    "admin@admin.com", 
                                    false)
                );
            }

            // Criar novo superusuário admin
            Superusuario admin = new Superusuario();
            admin.setCpf("00000000000");
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@admin.com");
            admin.setSenha(passwordEncoder.encode("admin")); // Senha criptografada
            
            Superusuario adminSalvo = superusuarioRepository.save(admin);
            
            return ResponseEntity.ok(
                new SetupResponse("✅ Admin criado com sucesso!", 
                                "admin@admin.com", 
                                true)
            );
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("❌ Erro ao criar admin: " + e.getMessage()));
        }
    }

    /**
     * 🔓 ENDPOINT PARA VERIFICAR SE O ADMIN EXISTE
     * URL: GET /api/auth/check-admin
     */
    @GetMapping("/check-admin")
    public ResponseEntity<?> checkAdmin() {
        boolean existe = superusuarioRepository.findByEmail("admin@admin.com").isPresent();
        
        return ResponseEntity.ok(
            new CheckAdminResponse(
                existe ? "✅ Admin existe" : "❌ Admin não encontrado",
                existe,
                "admin@admin.com"
            )
        );
    }

    /**
     * 🔓 ENDPOINT PARA REMOVER O ADMIN (apenas testes)
     * URL: DELETE /api/auth/remove-admin
     */
    @DeleteMapping("/remove-admin")
    public ResponseEntity<?> removeAdmin() {
        try {
            Optional<Superusuario> admin = superusuarioRepository.findByEmail("admin@admin.com");
            if (admin.isPresent()) {
                superusuarioRepository.delete(admin.get());
                return ResponseEntity.ok(
                    new SetupResponse("✅ Admin removido com sucesso", "admin@admin.com", true)
                );
            } else {
                return ResponseEntity.ok(
                    new SetupResponse("ℹ️ Admin não existia", "admin@admin.com", false)
                );
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("❌ Erro ao remover admin: " + e.getMessage()));
        }
    }

    /**
     * 🔓 ENDPOINT DE LOGIN ORIGINAL (mantido)
     */
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

    // ===== CLASSES DTO PARA RESPOSTAS =====

    public static class SetupResponse {
        private String mensagem;
        private String email;
        private boolean sucesso;
        
        public SetupResponse(String mensagem, String email, boolean sucesso) {
            this.mensagem = mensagem;
            this.email = email;
            this.sucesso = sucesso;
        }
        
        // Getters e Setters
        public String getMensagem() { return mensagem; }
        public void setMensagem(String mensagem) { this.mensagem = mensagem; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public boolean isSucesso() { return sucesso; }
        public void setSucesso(boolean sucesso) { this.sucesso = sucesso; }
    }

    public static class CheckAdminResponse {
        private String mensagem;
        private boolean existe;
        private String email;
        
        public CheckAdminResponse(String mensagem, boolean existe, String email) {
            this.mensagem = mensagem;
            this.existe = existe;
            this.email = email;
        }
        
        // Getters e Setters
        public String getMensagem() { return mensagem; }
        public void setMensagem(String mensagem) { this.mensagem = mensagem; }
        public boolean isExiste() { return existe; }
        public void setExiste(boolean existe) { this.existe = existe; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ErrorResponse {
        private String erro;
        
        public ErrorResponse(String erro) {
            this.erro = erro;
        }
        
        public String getErro() { return erro; }
        public void setErro(String erro) { this.erro = erro; }
    }

    // ===== CLASSES EXISTENTES (mantidas) =====

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

    // ===== MÉTODO OPCIONAL PARA CRIAÇÃO AUTOMÁTICA =====
    
    /**
     * Método opcional: criar admin automaticamente ao iniciar a aplicação
     * (Descomente a linha no construtor se quiser usar)
     */
    private void criarAdminSeNaoExistir() {
        if (superusuarioRepository.findByEmail("admin@admin.com").isEmpty()) {
            Superusuario admin = new Superusuario();
            admin.setCpf("00000000000");
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@admin.com");
            admin.setSenha(passwordEncoder.encode("admin"));
            
            superusuarioRepository.save(admin);
            System.out.println("✅ Superusuário admin criado automaticamente!");
        }
    }
}