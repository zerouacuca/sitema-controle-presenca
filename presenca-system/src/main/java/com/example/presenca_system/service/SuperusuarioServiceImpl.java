package com.example.presenca_system.service;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.repository.SuperusuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.presenca_system.security.JwtService;
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

    @Override
    public Superusuario cadastrarSuperusuario(Superusuario superusuario) {
        // Criptografar a senha antes de salvar
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
                    
                    //superusuarioExistente.setNome(superusuarioAtualizado.getNome());
                    superusuarioExistente.setEmail(superusuarioAtualizado.getEmail());
                    // Criptografa a nova senha se ela for diferente
                    if (superusuarioAtualizado.getSenha() != null && !superusuarioAtualizado.getSenha().isEmpty()) {
                        superusuarioExistente.setSenha(passwordEncoder.encode(superusuarioAtualizado.getSenha()));
                    }
                    // Adicione outros campos a serem atualizados aqui
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

    public String login(String email, String senha) {
        // 1. Busca o superusuário pelo e-mail
        Optional<Superusuario> superusuarioOptional = superusuarioRepository.findByEmail(email);

        if (superusuarioOptional.isPresent()) {
            Superusuario superusuario = superusuarioOptional.get();

            // 2. Valida se a senha informada corresponde à senha criptografada
            if (passwordEncoder.matches(senha, superusuario.getSenha())) {
                // 3. Se a senha for válida, gera e retorna o token JWT
                return jwtService.generateToken(superusuario.getEmail());
            }
        }
        // 4. Se o usuário não for encontrado ou a senha for inválida, lança uma exceção
        throw new RuntimeException("Credenciais inválidas");
    }
}