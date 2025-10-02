package com.example.presenca_system.config;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.service.SuperusuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SuperusuarioService superusuarioService;

    public DataInitializer(SuperusuarioService superusuarioService) {
        this.superusuarioService = superusuarioService;
    }

    @Override
    public void run(String... args) throws Exception {
        criarSuperusuarioPadrao();
    }

    private void criarSuperusuarioPadrao() {
        try {
            // Verifica se já existe algum superusuário no sistema
            if (!superusuarioService.existeAlgumSuperusuario()) {
                System.out.println("🔧 Criando superusuário padrão...");
                
                Superusuario admin = new Superusuario();
                admin.setCpf("00000000000"); // CPF genérico
                admin.setNome("Administrador do Sistema");
                admin.setEmail("admin@admin.com");
                admin.setSenha("admin"); // A senha será criptografada pelo service
                
                superusuarioService.criarPrimeiroSuperusuario(admin);
                
                System.out.println("✅ Superusuário padrão criado com sucesso!");
                System.out.println("📧 Email: admin@admin.com");
                System.out.println("🔑 Senha: admin");
            } else {
                System.out.println("ℹ️  Superusuários já existem no sistema. Pulando criação padrão.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar superusuário padrão: " + e.getMessage());
        }
    }
}