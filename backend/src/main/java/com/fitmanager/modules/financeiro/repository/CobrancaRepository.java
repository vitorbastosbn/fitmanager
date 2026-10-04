package com.fitmanager.modules.financeiro.repository;

import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {
    List<Cobranca> findByMatriculaId(Long matriculaId);

    @Query("SELECT c FROM Cobranca c WHERE c.matricula.aluno.id = :alunoId ORDER BY c.dataVencimento ASC")
    List<Cobranca> findByAlunoId(@Param("alunoId") Long alunoId);

    @Query("SELECT c FROM Cobranca c WHERE c.matricula.aluno.id = :alunoId AND c.status = :status ORDER BY c.dataVencimento ASC")
    List<Cobranca> findByAlunoIdAndStatus(@Param("alunoId") Long alunoId, @Param("status") StatusCobranca status);

    @Query("SELECT c FROM Cobranca c WHERE c.matricula.aluno.id = :alunoId AND c.status IN ('PENDENTE', 'ATRASADO') AND c.dataVencimento < :dataLimite")
    List<Cobranca> findInadimplentesAposTolerancia(@Param("alunoId") Long alunoId, @Param("dataLimite") LocalDate dataLimite);
}
