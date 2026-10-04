package com.fitmanager.modules.plano.repository;

import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.StatusMatricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    List<Matricula> findByAlunoId(Long alunoId);
    Optional<Matricula> findFirstByAlunoIdAndStatus(Long alunoId, StatusMatricula status);
    boolean existsByAlunoIdAndStatus(Long alunoId, StatusMatricula status);
}
