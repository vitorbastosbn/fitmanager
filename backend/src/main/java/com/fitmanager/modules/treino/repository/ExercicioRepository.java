package com.fitmanager.modules.treino.repository;

import com.fitmanager.modules.treino.domain.Exercicio;
import com.fitmanager.modules.treino.domain.GrupoMuscular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {
    List<Exercicio> findByAtivoTrue();
    List<Exercicio> findByGrupoMuscularAndAtivoTrue(GrupoMuscular grupoMuscular);
    Optional<Exercicio> findByNomeIgnoreCase(String nome);
}
