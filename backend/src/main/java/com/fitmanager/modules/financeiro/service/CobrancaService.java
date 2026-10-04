package com.fitmanager.modules.financeiro.service;

import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.PeriodicidadePlano;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CobrancaService {

    private final CobrancaRepository cobrancaRepository;

    public CobrancaService(CobrancaRepository cobrancaRepository) {
        this.cobrancaRepository = cobrancaRepository;
    }

    @Transactional
    public List<Cobranca> gerarCobrancasParaMatricula(Matricula matricula) {
        PeriodicidadePlano periodicidade = matricula.getPlano().getPeriodicidade();
        int totalParcelas = switch (periodicidade) {
            case MENSAL -> 1;
            case TRIMESTRAL -> 3;
            case ANUAL -> 12;
        };

        List<Cobranca> cobrancas = new ArrayList<>();
        LocalDate vencimentoBase = matricula.getDataInicio();

        for (int i = 0; i < totalParcelas; i++) {
            LocalDate dataVencimento = vencimentoBase.plusMonths(i);
            Cobranca cobranca = new Cobranca(
                    null,
                    matricula,
                    matricula.getValorMensalidadeContratada(),
                    dataVencimento,
                    StatusCobranca.PENDENTE
            );
            cobrancas.add(cobranca);
        }

        return cobrancaRepository.saveAll(cobrancas);
    }

    @Transactional(readOnly = true)
    public List<Cobranca> listarPorMatricula(Long matriculaId) {
        return cobrancaRepository.findByMatriculaId(matriculaId);
    }

    @Transactional(readOnly = true)
    public List<Cobranca> listarPorAluno(Long alunoId) {
        return cobrancaRepository.findByAlunoId(alunoId);
    }

    @Transactional(readOnly = true)
    public boolean possuiInadimplenciaAcimaDaTolerancia(Long alunoId, int diasTolerancia) {
        // ADR-010: Bloqueio de check-in para cobranças em aberto vencidas há mais de 5 dias corridos
        LocalDate dataLimite = LocalDate.now().minusDays(diasTolerancia);
        List<Cobranca> atrasadas = cobrancaRepository.findInadimplentesAposTolerancia(alunoId, dataLimite);
        return !atrasadas.isEmpty();
    }
}
