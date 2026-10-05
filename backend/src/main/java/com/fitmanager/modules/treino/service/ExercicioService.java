package com.fitmanager.modules.treino.service;

import com.fitmanager.modules.treino.domain.Exercicio;
import com.fitmanager.modules.treino.domain.GrupoMuscular;
import com.fitmanager.modules.treino.dto.ExercicioDTO;
import com.fitmanager.modules.treino.repository.ExercicioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;

    public ExercicioService(ExercicioRepository exercicioRepository) {
        this.exercicioRepository = exercicioRepository;
    }

    @Transactional(readOnly = true)
    public List<ExercicioDTO> listarExercicios(GrupoMuscular grupoMuscular) {
        List<Exercicio> exercicios;
        if (grupoMuscular != null) {
            exercicios = exercicioRepository.findByGrupoMuscularAndAtivoTrue(grupoMuscular);
        } else {
            exercicios = exercicioRepository.findByAtivoTrue();
        }
        return exercicios.stream().map(ExercicioDTO::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public Exercicio buscarPorId(Long id) {
        return exercicioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercício não encontrado."));
    }
}
