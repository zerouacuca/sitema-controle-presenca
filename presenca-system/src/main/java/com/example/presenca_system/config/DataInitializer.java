package com.example.presenca_system.config;

import com.example.presenca_system.model.*;
import com.example.presenca_system.model.enums.StatusEvento;
import com.example.presenca_system.repository.*;
import com.example.presenca_system.service.SuperusuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SuperusuarioService superusuarioService;
    private final SuperusuarioRepository superusuarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final CheckInRepository checkInRepository;
    private final CertificadoRepository certificadoRepository;

    public DataInitializer(SuperusuarioService superusuarioService,
                           SuperusuarioRepository superusuarioRepository,
                           UsuarioRepository usuarioRepository,
                           EventoRepository eventoRepository,
                           CheckInRepository checkInRepository,
                           CertificadoRepository certificadoRepository) {
        this.superusuarioService = superusuarioService;
        this.superusuarioRepository = superusuarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.checkInRepository = checkInRepository;
        this.certificadoRepository = certificadoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        criarSuperusuarioPadrao();
        //criarSuperusuariosAdicionais();
        //criarUsuariosComuns();
        //criarEventosParaAdmin();
        //criarCheckInsParaEventosAdmin();
        criarCertificadosParaEventosFinalizados();
    }

    private void criarSuperusuarioPadrao() {
        try {
            if (!superusuarioService.existeAlgumSuperusuario()) {
                System.out.println("  Criando superusuário padrão...");

                Superusuario admin = new Superusuario();
                admin.setMatricula("ADMIN001");
                admin.setNome("Administrador do Sistema");
                admin.setEmail("admin@admin.com");
                admin.setSenha("admin");

                superusuarioService.criarPrimeiroSuperusuario(admin);

                System.out.println("  Superusuário padrão criado com sucesso!");
            } else {
                System.out.println("ℹ️  Superusuários já existem no sistema. Pulando criação padrão.");
            }
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar superusuário padrão: " + e.getMessage());
        }
    }

    private void criarSuperusuariosAdicionais() {
        try {
            System.out.println("  Criando superusuários adicionais...");

            List<Superusuario> superusuarios = Arrays.asList(
                criarSuperusuario("12345678901", "João Superusuario", "joao.super@email.com", "senha123"),
                criarSuperusuario("23456789012", "Maria Superusuario", "maria.super@email.com", "senha123")
            );

            int criados = 0;
            for (Superusuario superusuario : superusuarios) {
                if (!superusuarioRepository.existsById(superusuario.getMatricula())) {
                    superusuarioService.criarPrimeiroSuperusuario(superusuario);
                    criados++;
                }
            }

            System.out.println("  " + criados + " superusuários adicionais criados com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar superusuários adicionais: " + e.getMessage());
        }
    }

    private void criarUsuariosComuns() {
        try {
            System.out.println("  Criando usuários comuns...");

            List<Usuario> usuarios = Arrays.asList(
                criarUsuario("João Silva", "joao.silva@email.com", "2023001", "TI", LocalDate.of(1990, 5, 15), "AQAAABQAAACkAQAAAQASAAMAZAAAAAAAoAEAAGVpUlQLyKMNGYtmV9YgPandN4py3guH6/Y36*cpZbUU2flJ9k6iDtdZI5uczb3MTu08Pw04s7OWC4VNAHzlzkxcdDS/BGLucDIl/vOz35/VVm8yASLDYuvymjUoh6CpyYAhAyjAdg6nfxXT8W*X/Hb77qLYkxwyAYIYheb2JGJd1gG53DrqObOOkMVeUdanLDt7ZHdRohJcAi/gWpF6TCjCuZ8wgW24bTF62xFTdMxJQHSmVJOvaAS/VacVSDe2KLQdzwxiYAJgvsHOnAlvDZMr8R*i4FlPA/Nzlq2ddKUg72q0cdKvJgw6a67zg8MCZkQR7DYBx2A4GdU2DpYQkhNvX7eZJTwvo8uzjwUvd67dTuwTbqM9jQ7y4TkfJ6hBJ5byGqsswbbgzfVHRBbJ2c*Q/gjkQEaPJJFrpZBvjh6VZLNCbiy3dmo3JOZJnzHy0v/asrCbzpnB0aQ37ilDiUvt645yLuTfSan2LJULw5Gkx8dXPpZ4QXeeN*eWw2o1IRR1co*bUir*rT3n1lGxZjk81c1R0yQEqQMHW13duKJq"),
                criarUsuario("Maria Santos", "maria.santos@email.com", "2023002", "RH", LocalDate.of(1985, 8, 22), "AQAAABQAAAC0AQAAAQASAAMAZAAAAAAApAEAADRgoEWeE07G8ZsrVC8r9cgAHpNZe3/smL3lhFuMaul5VgLkBEld82V/WHi8dPqQKRy8I4/41YUnCKuknTZsgLH2aKImFVjCsyHrG5fdShZ9QlRc54bp0liyWTxr0EZRnZimqD1LN81keAvI10TXFVfmfzYVrfm6MxjABZC00lnJMtcBCtdANeA0gm2S0oRHi8lzuFP2oCb//UdsRelVVUAk*hFWnXpZH4BRTyDNJU/kDsir4I9BQjBfaWV0ZkaWz3Z2TTx/iz9D9C4wHYnRQ6SkNqvjnzCBpKFeLyUTQgxoVC4Gpbv/q4ptJ2BpCymwmQ0MaaS8pSQXx8SSl9EfSZs9uRJXNVXM61TUlH71yzHxsxt25mOur0W9W*Iknl3qYtCJYnmqSjaJsoAjoaTTwrc4PqyTs76ZXeZDYa9bks4kQKqJNdLvGGhxrX31pKl/P13i6BsZPwkwJYYkp5zvF06P*KCSIbrCu34rYn6spMgdYnLji/85dDuskKlTNpjybUPBqjq3CiFZNs*USEzcjUY7eYhC1KGHFB4EryuteSDwCznWLqYibl2hgE6XB46tfw")
                );

            int criados = 0;
            for (Usuario usuario : usuarios) {
                if (!usuarioRepository.existsById(usuario.getMatricula())) {
                    usuarioRepository.save(usuario);
                    criados++;
                }
            }

            System.out.println("  " + criados + " usuários comuns criados com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar usuários comuns: " + e.getMessage());
        }
    }

     private void criarEventosParaAdmin() {
        try {
            System.out.println("  Criando eventos para o admin...");

            List<Evento> eventos = Arrays.asList(
                criarEvento("Workshop Spring Boot Avançado", "Workshop completo sobre desenvolvimento com Spring Boot, Security e JPA",
                           LocalDateTime.of(2024, 1, 10, 14, 0), "Tecnologia", 6.0, StatusEvento.FINALIZADO, "ADMIN001"),

                criarEvento("Treinamento Angular & TypeScript", "Desenvolvimento de aplicações web modernas com Angular e TypeScript",
                           LocalDateTime.of(2024, 1, 25, 9, 0), "Tecnologia", 8.0, StatusEvento.EM_ANDAMENTO, "ADMIN001"),

                criarEvento("Palestra Cloud Computing AWS", "Introdução aos serviços AWS e computação em nuvem",
                           LocalDateTime.of(2024, 2, 15, 16, 0), "Tecnologia", 4.0, StatusEvento.AGENDADO, "ADMIN001"),

                criarEvento("Workshop DevOps CI/CD", "Pipeline de integração e deploy contínuo com Jenkins e Docker",
                           LocalDateTime.of(2024, 2, 28, 13, 0), "Tecnologia", 5.0, StatusEvento.AGENDADO, "ADMIN001"),

                criarEvento("Curso React Native", "Desenvolvimento de aplicativos móveis com React Native",
                           LocalDateTime.of(2024, 3, 10, 10, 0), "Tecnologia", 12.0, StatusEvento.AGENDADO, "ADMIN001"),

                criarEvento("Seminário Segurança da Informação", "Melhores práticas e ferramentas de segurança digital",
                           LocalDateTime.of(2024, 3, 20, 8, 30), "Segurança", 6.0, StatusEvento.AGENDADO, "ADMIN001")
            );

            int criados = 0;
            for (Evento evento : eventos) {
                List<Evento> eventosComMesmoTitulo = eventoRepository.findAll().stream()
                    .filter(e -> e.getTitulo().equals(evento.getTitulo()))
                    .collect(Collectors.toList());

                if (eventosComMesmoTitulo.isEmpty()) {
                    eventoRepository.save(evento);
                    criados++;
                }
            }

            System.out.println("  " + criados + " eventos criados para o admin com sucesso!");
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar eventos para admin: " + e.getMessage());
        }
    }

     private void criarCheckInsParaEventosAdmin() {
        try {
            System.out.println("  Criando check-ins para eventos do admin...");

            criarCheckIn(1L, "2023001", LocalDateTime.of(2024, 1, 10, 13, 55));
            criarCheckIn(1L, "2023002", LocalDateTime.of(2024, 1, 10, 13, 58));
            
            criarCheckIn(2L, "2023001", LocalDateTime.of(2024, 1, 25, 8, 55));
            criarCheckIn(2L, "2023002", LocalDateTime.of(2024, 1, 25, 8, 58));
            
            System.out.println("  Check-ins criados com sucesso para eventos do admin!");
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar check-ins para admin: " + e.getMessage());
        }
    }

     private void criarCertificadosParaEventosFinalizados() {
        try {
            System.out.println("  Criando certificados para eventos finalizados...");

            criarCertificado("2023001", 1L, "ADMIN001", "CERT-SPRING-001", LocalDate.of(2024, 1, 11));
            criarCertificado("2023002", 1L, "ADMIN001", "CERT-SPRING-002", LocalDate.of(2024, 1, 11));
           
            System.out.println("  Certificados criados com sucesso para eventos finalizados!");
        } catch (Exception e) {
            System.err.println("❌ Erro ao criar certificados: " + e.getMessage());
        }
    }


    private Superusuario criarSuperusuario(String cpf, String nome, String email, String senha) {
        Superusuario superusuario = new Superusuario();
        // superusuario.setCpf(cpf); // Removido
        superusuario.setNome(nome);
        superusuario.setEmail(email);
        superusuario.setSenha(senha);
        return superusuario;
    }

    private Usuario criarUsuario(String nome, String email, String matricula,
                               String setor, LocalDate dataNascimento, String template) {
        Usuario usuario = new Usuario();
        usuario.setMatricula(matricula);
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSetor(setor);
        usuario.setDataNascimento(dataNascimento);
        // ===== ALTERADO DE .getBytes() PARA ATRIBUIÇÃO DIRETA =====
        usuario.setTemplate(template);
        // ========================================================
        return usuario;
    }


     private Evento criarEvento(String titulo, String descricao, LocalDateTime dataHora,
                              String categoria, double cargaHoraria, StatusEvento status, String superusuarioMatricula) {
        Evento evento = new Evento();
        evento.setTitulo(titulo);
        evento.setDescricao(descricao);
        evento.setDataHora(java.util.Date.from(dataHora.atZone(java.time.ZoneId.systemDefault()).toInstant()));
        evento.setCategoria(categoria);
        evento.setCargaHoraria(cargaHoraria);
        evento.setStatus(status);

        Optional<Superusuario> superusuarioOpt = superusuarioRepository.findById(superusuarioMatricula);
        if (superusuarioOpt.isPresent()) {
            evento.setSuperusuario(superusuarioOpt.get());
        } else {
            Optional<Superusuario> adminOpt = superusuarioRepository.findById("ADMIN001");
            adminOpt.ifPresent(evento::setSuperusuario);
        }

        return evento;
    }

    private void criarCheckIn(Long eventoId, String usuarioMatricula, LocalDateTime dataHora) {
        try {
            Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioMatricula);

            if (eventoOpt.isPresent() && usuarioOpt.isPresent()) {
                Optional<CheckIn> checkinExistente = checkInRepository.findByUsuarioAndEvento(usuarioOpt.get(), eventoOpt.get());

                if (checkinExistente.isEmpty()) {
                    CheckIn checkIn = new CheckIn();
                    checkIn.setEvento(eventoOpt.get());
                    checkIn.setUsuario(usuarioOpt.get());
                    checkIn.setDataHoraCheckin(java.util.Date.from(dataHora.atZone(java.time.ZoneId.systemDefault()).toInstant()));
                    checkInRepository.save(checkIn);
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️  Erro ao criar check-in para evento " + eventoId + ", usuário " + usuarioMatricula + ": " + e.getMessage());
        }
    }

    private void criarCertificado(String usuarioMatricula, Long eventoId, String superusuarioMatricula,
                                String codigoValidacao, LocalDate dataEmissao) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioMatricula);
            Optional<Evento> eventoOpt = eventoRepository.findById(eventoId);
            Optional<Superusuario> superusuarioOpt = superusuarioRepository.findById(superusuarioMatricula);

            if (usuarioOpt.isPresent() && eventoOpt.isPresent() && superusuarioOpt.isPresent()) {
                Optional<Certificado> certificadoExistente = certificadoRepository.findByUsuarioMatriculaAndEventoEventoId(usuarioMatricula, eventoId);

                if (certificadoExistente.isEmpty()) {
                    Certificado certificado = new Certificado();
                    certificado.setUsuario(usuarioOpt.get());
                    certificado.setEvento(eventoOpt.get());
                    certificado.setSuperusuario(superusuarioOpt.get());
                    certificado.setCodigoValidacao(codigoValidacao);
                    certificado.setDataEmissao(dataEmissao);
                    certificado.setTexto("Certificado de participação no evento \"" + eventoOpt.get().getTitulo() +
                                       "\" com carga horária de " + eventoOpt.get().getCargaHoraria() + " horas. " +
                                       "Emitido por " + superusuarioOpt.get().getNome() + ".");

                    certificadoRepository.save(certificado);
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️  Erro ao criar certificado para usuário " + usuarioMatricula + ", evento " + eventoId + ": " + e.getMessage());
        }
    }

}