package com.fitmanager.modules.lgpd.repository;

import com.fitmanager.modules.lgpd.domain.ConsentimentoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsentimentoUsuarioRepository extends JpaRepository<ConsentimentoUsuario, Long> {
    boolean existsByUsuarioIdAndTermoIdAndAceitoTrue(Long usuarioId, Long termoId);
    List<ConsentimentoUsuario> findByUsuarioId(Long usuarioId);
}
