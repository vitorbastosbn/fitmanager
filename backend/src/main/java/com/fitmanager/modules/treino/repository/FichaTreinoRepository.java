package com.fitmanager.modules.treino.repository;

import com.fitmanager.modules.treino.domain.FichaTreino;
import com.fitmanager.modules.treino.domain.StatusFicha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FichaTreinoRepository extends JpaRepository<FichaTreino, Long> {

    @Query("SELECT DISTINCT f FROM FichaTreino f " +
           "LEFT JOIN FETCH f.divisoes d " +
           "LEFT JOIN FETCH d.itens i " +
           "LEFT JOIN FETCH i.exercicio " +
           "WHERE f.aluno.id = :alunoId AND f.status = :status")
    Optional<FichaTreino> findFirstByAlunoIdAndStatusWithDetails(@Param("alunoId") Long alunoId, @Param("status") StatusFicha status);

    List<FichaTreino> findByAlunoIdAndStatus(Long alunoId, StatusFicha status);

    List<FichaTreino> findByAlunoIdOrderByDataInicioDesc(Long alunoId);
}
