package com.example.presenca_system.service.impl;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.repository.SuperusuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.presenca_system.security.JwtService;
import com.example.presenca_system.service.SuperusuarioService;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class SuperusuarioServiceImpl implements SuperusuarioService {

    private final SuperusuarioRepository superusuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public SuperusuarioServiceImpl(SuperusuarioRepository superusuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.superusuarioRepository = superusuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // 🔐 NOVOS MÉTODOS PARA VALIDAÇÃO DE PERMISSÕES
    @Override
    public Superusuario cadastrarSuperusuario(Superusuario superusuario, String emailSuperusuarioAutenticado) {
        // Verificar se o superusuário autenticado tem permissão para criar outros
        Optional<Superusuario> autenticado = superusuarioRepository.findByEmail(emailSuperusuarioAutenticado);
        if (autenticado.isEmpty()) {
            throw new RuntimeException("Superusuário autenticado não encontrado");
        }
        
        // Aqui você pode adicionar lógica de autorização (ex: apenas admin pode criar)
        return cadastrarSuperusuario(superusuario);
    }

    @Override
    public Superusuario alterarSuperusuario(String cpf, Superusuario superusuarioAtualizado, String emailSuperusuarioAutenticado) {
        // Verificar permissões
        Optional<Superusuario> autenticado = superusuarioRepository.findByEmail(emailSuperusuarioAutenticado);
        if (autenticado.isEmpty()) {
            throw new RuntimeException("Superusuário autenticado não encontrado");
        }
        
        // Impedir que um superusuário altere seus próprios dados sem verificação adicional
        if (autenticado.get().getCpf().equals(cpf)) {
            throw new RuntimeException("Não é permitido alterar o próprio usuário por esta operação");
        }
        
        return alterarSuperusuario(cpf, superusuarioAtualizado);
    }

    @Override
    public void excluirSuperusuario(String cpf, String emailSuperusuarioAutenticado) {
        // Verificar permissões
        Optional<Superusuario> autenticado = superusuarioRepository.findByEmail(emailSuperusuarioAutenticado);
        if (autenticado.isEmpty()) {
            throw new RuntimeException("Superusuário autenticado não encontrado");
        }
        
        // Impedir auto-exclusão
        if (autenticado.get().getCpf().equals(cpf)) {
            throw new RuntimeException("Não é permitido excluir o próprio usuário");
        }
        
        excluirSuperusuario(cpf);
    }

    @Override
    public List<Superusuario> listarTodos(String emailSuperusuarioAutenticado) {
        // Apenas verificar que está autenticado
        Optional<Superusuario> autenticado = superusuarioRepository.findByEmail(emailSuperusuarioAutenticado);
        if (autenticado.isEmpty()) {
            throw new RuntimeException("Superusuário autenticado não encontrado");
        }
        
        return listarTodos();
    }

    // MÉTODOS EXISTENTES (mantidos conforme seu código)
    @Override
    public Superusuario cadastrarSuperusuario(Superusuario superusuario) {
        superusuario.setSenha(passwordEncoder.encode(superusuario.getSenha()));
        return superusuarioRepository.save(superusuario);
    }

    @Override
    public Optional<Superusuario> buscarPorEmail(String email) {
        return superusuarioRepository.findByEmail(email);
    }

    @Override
    public Superusuario alterarSuperusuario(String cpf, Superusuario superusuarioAtualizado) {
        return superusuarioRepository.findById(cpf)
                .map(superusuarioExistente -> {
                    superusuarioExistente.setEmail(superusuarioAtualizado.getEmail());
                    if (superusuarioAtualizado.getSenha() != null && !superusuarioAtualizado.getSenha().isEmpty()) {
                        superusuarioExistente.setSenha(passwordEncoder.encode(superusuarioAtualizado.getSenha()));
                    }
                    return superusuarioRepository.save(superusuarioExistente);
                })
                .orElseThrow(() -> new RuntimeException("Superusuário não encontrado com o CPF: " + cpf));
    }

    @Override
    public void excluirSuperusuario(String cpf) {
        superusuarioRepository.deleteById(cpf);
    }
    
    @Override
    public List<Superusuario> listarTodos() {
        return superusuarioRepository.findAll();
    }

    @Override
    public String login(String email, String senha) {
        Optional<Superusuario> superusuarioOptional = superusuarioRepository.findByEmail(email);

        if (superusuarioOptional.isPresent()) {
            Superusuario superusuario = superusuarioOptional.get();
            if (passwordEncoder.matches(senha, superusuario.getSenha())) {
                return jwtService.generateToken(superusuario.getEmail());
            }
        }
        throw new RuntimeException("Credenciais inválidas");
    }

    /**
     * Verifica se existe algum superusuário no sistema
     */
    public boolean existeAlgumSuperusuario() {
        return superusuarioRepository.count() > 0;
    }

    /**
     * Cria o primeiro superusuário do sistema (método especial para inicialização)
     */
    public Superusuario criarPrimeiroSuperusuario(Superusuario superusuario) {
        // Validações básicas
        if (superusuario.getEmail() == null || superusuario.getSenha() == null) {
            throw new RuntimeException("Email e senha são obrigatórios");
        }
        
        // Verifica se já existe um usuário com este email
        if (superusuarioRepository.findByEmail(superusuario.getEmail()).isPresent()) {
            throw new RuntimeException("Já existe um usuário com este email");
        }
        
        // Criptografa a senha
        String senhaCriptografada = passwordEncoder.encode(superusuario.getSenha());
        superusuario.setSenha(senhaCriptografada);
        
        // Salva o superusuário
        return superusuarioRepository.save(superusuario);
    }
}