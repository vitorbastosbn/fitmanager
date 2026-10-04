package com.fitmanager.modules.treino.service;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.treino.domain.*;
import com.fitmanager.modules.treino.dto.CriarDivisaoDTO;
import com.fitmanager.modules.treino.dto.CriarFichaTreinoDTO;
import com.fitmanager.modules.treino.dto.CriarItemDivisaoDTO;
import com.fitmanager.modules.treino.dto.FichaTreinoDTO;
import com.fitmanager.modules.treino.repository.ExercicioRepository;
import com.fitmanager.modules.treino.repository.FichaTreinoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FichaTreinoService {

    private final FichaTreinoRepository fichaTreinoRepository;
    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ExercicioRepository exercicioRepository;

    public FichaTreinoService(
            FichaTreinoRepository fichaTreinoRepository,
            AlunoRepository alunoRepository,
            UsuarioRepository usuarioRepository,
            ExercicioRepository exercicioRepository) {
        this.fichaTreinoRepository = fichaTreinoRepository;
        this.alunoRepository = alunoRepository;
        this.usuarioRepository = usuarioRepository;
        this.exercicioRepository = exercicioRepository;
    }

    @Transactional
    public FichaTreinoDTO prescreverFicha(CriarFichaTreinoDTO dto, String instrutorEmail) {
        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aluno não encontrado."));

        if (aluno.getStatus() != StatusAluno.ATIVO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é permitido criar ficha para aluno inativo.");
        }

        Usuario instrutor = usuarioRepository.findByEmail(instrutorEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Instrutor não encontrado."));

        // EARS-TRE-006: Arquivar automaticamente ficha ativa anterior do mesmo aluno como HISTORICO
        List<FichaTreino> fichasAtivasAnteriores = fichaTreinoRepository.findByAlunoIdAndStatus(aluno.getId(), StatusFicha.ATIVA);
        for (FichaTreino anterior : fichasAtivasAnteriores) {
            anterior.setStatus(StatusFicha.HISTORICO);
            fichaTreinoRepository.save(anterior);
        }

        FichaTreino novaFicha = new FichaTreino(
                null,
                aluno,
                instrutor,
                dto.getObjetivo(),
                dto.getDataInicio(),
                dto.getDataValidade(),
                StatusFicha.ATIVA
        );

        for (CriarDivisaoDTO divDto : dto.getDivisoes()) {
            DivisaoTreino divisao = new DivisaoTreino(null, novaFicha, divDto.getLetra(), divDto.getNome(), divDto.getOrdem());
            for (CriarItemDivisaoDTO itemDto : divDto.getItens()) {
                Exercicio exercicio = exercicioRepository.findById(itemDto.getExercicioId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercício ID " + itemDto.getExercicioId() + " não encontrado."));

                ItemDivisao item = new ItemDivisao(
                        null,
                        divisao,
                        exercicio,
                        itemDto.getOrdemExecucao(),
                        itemDto.getSeries(),
                        itemDto.getRepeticoes(),
                        itemDto.getCargaKg(),
                        itemDto.getDescansoSegundos(),
                        itemDto.getObservacoes()
                );
                divisao.adicionarItem(item);
            }
            novaFicha.adicionarDivisao(divisao);
        }

        FichaTreino salva = fichaTreinoRepository.save(novaFicha);
        return FichaTreinoDTO.fromEntity(salva);
    }

    @Transactional(readOnly = true)
    public FichaTreinoDTO buscarFichaAtiva(Long alunoId) {
        FichaTreino ficha = fichaTreinoRepository.findFirstByAlunoIdAndStatusWithDetails(alunoId, StatusFicha.ATIVA)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma ficha de treino ativa encontrada para este aluno."));
        return FichaTreinoDTO.fromEntity(ficha);
    }
}
