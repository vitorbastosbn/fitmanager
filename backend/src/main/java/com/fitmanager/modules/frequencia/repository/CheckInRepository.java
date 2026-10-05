package com.fitmanager.modules.frequencia.repository;

import com.fitmanager.modules.frequencia.domain.CheckIn;
import com.fitmanager.modules.frequencia.domain.StatusAcessoCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {

    boolean existsByTokenNonce(String tokenNonce);

    Optional<CheckIn> findFirstByAlunoIdAndStatusOrderByDataHoraDesc(Long alunoId, StatusAcessoCheckin status);

    @Query("SELECT c FROM CheckIn c JOIN FETCH c.aluno WHERE c.dataHora >= :inicio AND c.dataHora <= :fim ORDER BY c.dataHora DESC")
    List<CheckIn> findByDataHoraBetweenWithAluno(@Param("inicio") OffsetDateTime inicio, @Param("fim") OffsetDateTime fim);

    long countByStatusAndDataHoraBetween(StatusAcessoCheckin status, OffsetDateTime inicio, OffsetDateTime fim);

    long countByAlunoIdAndStatusAndDataHoraBetween(Long alunoId, StatusAcessoCheckin status, OffsetDateTime inicio, OffsetDateTime fim);

    List<CheckIn> findTop10ByOrderByDataHoraDesc();
}
