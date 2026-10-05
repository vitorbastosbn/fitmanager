package com.fitmanager.modules.plano.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.core.exception.RegraNegocioException;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.service.AlunoService;
import com.fitmanager.modules.financeiro.service.CobrancaService;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.Plano;
import com.fitmanager.modules.plano.domain.StatusMatricula;
import com.fitmanager.modules.plano.dto.CancelarMatriculaDTO;
import com.fitmanager.modules.plano.dto.MatriculaCreateDTO;
import com.fitmanager.modules.plano.dto.MatriculaResponseDTO;
import com.fitmanager.modules.plano.repository.MatriculaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;
    private final AlunoService alunoService;
    private final PlanoService planoService;
    private final CobrancaService cobrancaService;

    public MatriculaService(
            MatriculaRepository matriculaRepository,
            AlunoService alunoService,
            PlanoService planoService,
            CobrancaService cobrancaService) {
        this.matriculaRepository = matriculaRepository;
        this.alunoService = alunoService;
        this.planoService = planoService;
        this.cobrancaService = cobrancaService;
    }

    @Transactional
    public MatriculaResponseDTO matricular(MatriculaCreateDTO dto) {
        Aluno aluno = alunoService.buscarEntidadePorId(dto.getAlunoId());
        Plano plano = planoService.buscarEntidadePorId(dto.getPlanoId());

        if (Boolean.FALSE.equals(plano.getAtivo())) {
            throw new RegraNegocioException("Não é possível matricular em um plano inativo.");
        }

        // ADR-004: Apenas 1 matrícula ativa por aluno por período
        if (matriculaRepository.existsByAlunoIdAndStatus(aluno.getId(), StatusMatricula.ATIVA)) {
            throw new RegraNegocioException("O aluno já possui uma matrícula ativa no momento. Cancele a anterior para prosseguir.");
        }

        // Cálculo de vigência pela periodicidade do plano
        LocalDate dataInicio = dto.getDataInicio();
        LocalDate dataTermino = switch (plano.getPeriodicidade()) {
            case MENSAL -> dataInicio.plusMonths(1);
            case TRIMESTRAL -> dataInicio.plusMonths(3);
            case ANUAL -> dataInicio.plusYears(1);
        };

        Matricula matricula = new Matricula(
                null,
                aluno,
                plano,
                dataInicio,
                dataTermino,
                plano.getValorMensalidade(),
                StatusMatricula.ATIVA
        );

        matricula = matriculaRepository.save(matricula);

        // TASK-FIN-004: Geração automática de cobranças na criação da matrícula
        cobrancaService.gerarCobrancasParaMatricula(matricula);

        return MatriculaResponseDTO.fromEntity(matricula);
    }

    @Transactional
    public MatriculaResponseDTO cancelar(Long id, CancelarMatriculaDTO dto) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Matrícula não encontrada com ID: " + id));

        if (matricula.getStatus() == StatusMatricula.CANCELADA) {
            throw new RegraNegocioException("A matrícula informada já se encontra cancelada.");
        }

        matricula.setStatus(StatusMatricula.CANCELADA);
        matricula.setDataCancelamento(OffsetDateTime.now());
        matricula.setMotivoCancelamento(dto.getMotivo());

        matricula = matriculaRepository.save(matricula);
        return MatriculaResponseDTO.fromEntity(matricula);
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponseDTO> listarPorAluno(Long alunoId) {
        return matriculaRepository.findByAlunoId(alunoId)
                .stream()
                .map(MatriculaResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Matricula> buscarAtivaPorAluno(Long alunoId) {
        return matriculaRepository.findFirstByAlunoIdAndStatus(alunoId, StatusMatricula.ATIVA);
    }
}
