package com.fitmanager.modules.colaborador.repository;

import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.domain.Colaborador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByEmail(String email);

    boolean existsByCpfAndIdNot(String cpf, Long id);

    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<Colaborador> findByUsuarioId(Long usuarioId);

    Optional<Colaborador> findByEmail(String email);

    List<Colaborador> findByCargoPerfilAndAtivoTrue(CargoPerfil cargoPerfil);

    Page<Colaborador> findByNomeContainingIgnoreCaseOrCpfContaining(String nome, String cpf, Pageable pageable);

    long countByCargoPerfilAndAtivoTrue(CargoPerfil cargoPerfil);
}
