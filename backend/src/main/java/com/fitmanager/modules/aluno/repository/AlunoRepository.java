package com.fitmanager.modules.aluno.repository;

import com.fitmanager.modules.aluno.domain.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long>, JpaSpecificationExecutor<Aluno> {
    Optional<Aluno> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
    Optional<Aluno> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Aluno> findByUsuarioId(Long usuarioId);
}
