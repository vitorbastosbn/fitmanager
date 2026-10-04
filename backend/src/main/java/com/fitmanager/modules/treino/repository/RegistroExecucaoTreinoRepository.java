package com.fitmanager.modules.treino.repository;

import com.fitmanager.modules.treino.domain.RegistroExecucaoTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistroExecucaoTreinoRepository extends JpaRepository<RegistroExecucaoTreino, Long> {
    List<RegistroExecucaoTreino> findByAlunoIdOrderByDataHoraExecucaoDesc(Long alunoId);
    List<RegistroExecucaoTreino> findByItemDivisaoIdOrderByDataHoraExecucaoDesc(Long itemDivisaoId);
}
