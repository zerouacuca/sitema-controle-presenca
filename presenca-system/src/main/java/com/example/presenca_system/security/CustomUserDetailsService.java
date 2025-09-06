package com.example.presenca_system.security;

import com.example.presenca_system.model.Superusuario;
import com.example.presenca_system.repository.SuperusuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final SuperusuarioRepository superusuarioRepository;

    public CustomUserDetailsService(SuperusuarioRepository superusuarioRepository) {
        this.superusuarioRepository = superusuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Superusuario> superusuarioOptional = superusuarioRepository.findByEmail(email);
        if (superusuarioOptional.isPresent()) {
            Superusuario superusuario = superusuarioOptional.get();
            return new CustomUserDetails(superusuario.getEmail(), superusuario.getSenha());
        }
        throw new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + email);
    }
}