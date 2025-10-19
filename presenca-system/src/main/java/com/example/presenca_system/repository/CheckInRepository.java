package com.example.presenca_system.repository;

import com.example.presenca_system.model.CheckIn;
import com.example.presenca_system.model.Evento;
import com.example.presenca_system.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    
    // MÉTODOS EXISTENTES
    Optional<CheckIn> findByUsuarioAndEvento(Usuario usuario, Evento evento);
    List<CheckIn> findByEvento(Evento evento);
    List<CheckIn> findByEvento_EventoId(Long eventoId);

    //  MÉTODOS PARA VALIDAÇÃO POR SUPERUSUÁRIO
    @Query("SELECT ci FROM CheckIn ci WHERE ci.evento.eventoId = :eventoId AND ci.evento.superusuario.email = :emailSuperusuario")
    List<CheckIn> findByEventoAndSuperusuarioEmail(@Param("eventoId") Long eventoId, 
                                                  @Param("emailSuperusuario") String emailSuperusuario);

    // Método para contar check-ins por evento e superusuário
    @Query("SELECT COUNT(ci) FROM CheckIn ci WHERE ci.evento.eventoId = :eventoId AND ci.evento.superusuario.email = :emailSuperusuario")
    Long countByEventoAndSuperusuarioEmail(@Param("eventoId") Long eventoId, 
                                          @Param("emailSuperusuario") String emailSuperusuario);

    // Método para buscar check-ins por usuário e superusuário
    @Query("SELECT ci FROM CheckIn ci WHERE ci.usuario.cpf = :usuarioCpf AND ci.evento.superusuario.email = :emailSuperusuario")
    List<CheckIn> findByUsuarioAndSuperusuarioEmail(@Param("usuarioCpf") String usuarioCpf, 
                                                   @Param("emailSuperusuario") String emailSuperusuario);
}