package com.fitmanager.modules.dashboard.service;

import com.fitmanager.core.exception.RecursoNaoEncontradoException;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.repository.ColaboradorRepository;
import com.fitmanager.modules.dashboard.dto.*;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.frequencia.domain.CheckIn;
import com.fitmanager.modules.frequencia.domain.StatusAcessoCheckin;
import com.fitmanager.modules.frequencia.repository.CheckInRepository;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.StatusMatricula;
import com.fitmanager.modules.plano.repository.MatriculaRepository;
import com.fitmanager.modules.treino.domain.FichaTreino;
import com.fitmanager.modules.treino.domain.StatusFicha;
import com.fitmanager.modules.treino.repository.FichaTreinoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
public class DashboardService {

    private final AlunoRepository alunoRepository;
    private final CobrancaRepository cobrancaRepository;
    private final CheckInRepository checkInRepository;
    private final MatriculaRepository matriculaRepository;
    private final FichaTreinoRepository fichaTreinoRepository;
    private final ColaboradorRepository colaboradorRepository;

    public DashboardService(AlunoRepository alunoRepository,
                            CobrancaRepository cobrancaRepository,
                            CheckInRepository checkInRepository,
                            MatriculaRepository matriculaRepository,
                            FichaTreinoRepository fichaTreinoRepository,
                            ColaboradorRepository colaboradorRepository) {
        this.alunoRepository = alunoRepository;
        this.cobrancaRepository = cobrancaRepository;
        this.checkInRepository = checkInRepository;
        this.matriculaRepository = matriculaRepository;
        this.fichaTreinoRepository = fichaTreinoRepository;
        this.colaboradorRepository = colaboradorRepository;
    }

    @Transactional(readOnly = true)
    public DashboardAdminDTO obterDashboardAdmin() {
        LocalDate hoje = LocalDate.now();
        LocalDate primeiroDiaMesAtual = hoje.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate ultimoDiaMesAtual = hoje.with(TemporalAdjusters.lastDayOfMonth());

        LocalDate primeiroDiaMesAnterior = hoje.minusMonths(1).with(TemporalAdjusters.firstDayOfMonth());
        LocalDate ultimoDiaMesAnterior = hoje.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());

        OffsetDateTime inicioHoje = hoje.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime fimHoje = hoje.atTime(LocalTime.MAX).atOffset(ZoneOffset.UTC);

        OffsetDateTime inicioMesAtual = primeiroDiaMesAtual.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime fimMesAtual = ultimoDiaMesAtual.atTime(LocalTime.MAX).atOffset(ZoneOffset.UTC);

        OffsetDateTime inicioMesAnterior = primeiroDiaMesAnterior.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime fimMesAnterior = ultimoDiaMesAnterior.atTime(LocalTime.MAX).atOffset(ZoneOffset.UTC);

        long totalAlunosAtivos = alunoRepository.countByStatus(StatusAluno.ATIVO);
        long totalAlunosInativos = alunoRepository.countByStatus(StatusAluno.INATIVO);

        BigDecimal faturamentoMesAtual = cobrancaRepository.sumValorPagoBetween(inicioMesAtual, fimMesAtual);
        BigDecimal faturamentoMesAnterior = cobrancaRepository.sumValorPagoBetween(inicioMesAnterior, fimMesAnterior);
        BigDecimal valorEmAtraso = cobrancaRepository.sumValorAtrasado(hoje);

        double taxaInadimplencia = 0.0;
        BigDecimal montanteTotal = faturamentoMesAtual.add(valorEmAtraso);
        if (montanteTotal.compareTo(BigDecimal.ZERO) > 0) {
            taxaInadimplencia = valorEmAtraso.divide(montanteTotal, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        long checkInsHoje = checkInRepository.countByStatusAndDataHoraBetween(StatusAcessoCheckin.LIBERADO, inicioHoje, fimHoje);
        long totalColaboradoresAtivos = colaboradorRepository.count();

        // Fluxo de check-in por horário do dia (faixas das 6h às 22h)
        List<CheckIn> checkInsDoDia = checkInRepository.findByDataHoraBetweenWithAluno(inicioHoje, fimHoje);
        Map<Integer, Long> contagemPorHora = new HashMap<>();
        for (CheckIn c : checkInsDoDia) {
            if (c.getStatus() == StatusAcessoCheckin.LIBERADO) {
                int hora = c.getDataHora().getHour();
                contagemPorHora.put(hora, contagemPorHora.getOrDefault(hora, 0L) + 1);
            }
        }

        List<FluxoHorarioDTO> fluxoPorHorario = new ArrayList<>();
        for (int h = 6; h <= 22; h++) {
            fluxoPorHorario.add(new FluxoHorarioDTO(h, contagemPorHora.getOrDefault(h, 0L)));
        }

        return new DashboardAdminDTO(
                totalAlunosAtivos,
                totalAlunosInativos,
                faturamentoMesAtual,
                faturamentoMesAnterior,
                valorEmAtraso,
                taxaInadimplencia,
                checkInsHoje,
                totalColaboradoresAtivos,
                fluxoPorHorario
        );
    }

    @Transactional(readOnly = true)
    public DashboardRecepcaoDTO obterDashboardRecepcao() {
        LocalDate hoje = LocalDate.now();
        OffsetDateTime inicioHoje = hoje.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime fimHoje = hoje.atTime(LocalTime.MAX).atOffset(ZoneOffset.UTC);

        long checkInsHoje = checkInRepository.countByStatusAndDataHoraBetween(StatusAcessoCheckin.LIBERADO, inicioHoje, fimHoje);
        long bloqueiosHoje = checkInRepository.countByStatusAndDataHoraBetween(StatusAcessoCheckin.BLOQUEADO, inicioHoje, fimHoje);
        long faturasVencendoHoje = cobrancaRepository.countByDataVencimentoAndStatus(hoje, StatusCobranca.PENDENTE);
        long matriculasVencendoEm7Dias = matriculaRepository.countByDataTerminoBetweenAndStatus(hoje, hoje.plusDays(7), StatusMatricula.ATIVA);

        List<CheckInRecenteDTO> ultimosCheckIns = checkInRepository.findTop10ByOrderByDataHoraDesc()
                .stream()
                .map(c -> new CheckInRecenteDTO(
                        c.getId(),
                        c.getAluno() != null ? c.getAluno().getNome() : "Desconhecido",
                        c.getStatus().name(),
                        c.getMotivoBloqueio(),
                        c.getDataHora()
                ))
                .toList();

        return new DashboardRecepcaoDTO(
                checkInsHoje,
                bloqueiosHoje,
                faturasVencendoHoje,
                matriculasVencendoEm7Dias,
                ultimosCheckIns
        );
    }

    @Transactional(readOnly = true)
    public DashboardInstrutorDTO obterDashboardInstrutor(String email) {
        long totalAlunosAtivos = alunoRepository.countByStatus(StatusAluno.ATIVO);
        long totalFichasPrescritas = fichaTreinoRepository.count();

        // Buscar alunos ativos sem ficha ativa
        List<Aluno> todosAlunosAtivos = alunoRepository.findAll().stream()
                .filter(a -> a.getStatus() == StatusAluno.ATIVO)
                .toList();

        List<FichaPendenteDTO> listaAlunosPendentes = new ArrayList<>();
        for (Aluno aluno : todosAlunosAtivos) {
            List<FichaTreino> fichas = fichaTreinoRepository.findByAlunoIdAndStatus(aluno.getId(), StatusFicha.ATIVA);
            if (fichas.isEmpty()) {
                listaAlunosPendentes.add(new FichaPendenteDTO(aluno.getId(), aluno.getNome(), aluno.getDataNascimento()));
            }
        }

        long alunosSemFicha = listaAlunosPendentes.size();

        return new DashboardInstrutorDTO(
                totalAlunosAtivos,
                totalFichasPrescritas,
                alunosSemFicha,
                listaAlunosPendentes.stream().limit(8).toList()
        );
    }

    @Transactional(readOnly = true)
    public DashboardAlunoDTO obterDashboardAluno(String email) {
        Aluno aluno = alunoRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Perfil de aluno não localizado para o e-mail: " + email));

        LocalDate hoje = LocalDate.now();
        LocalDate segundaFeira = hoje.with(DayOfWeek.MONDAY);
        OffsetDateTime inicioSemana = segundaFeira.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime fimHoje = hoje.atTime(LocalTime.MAX).atOffset(ZoneOffset.UTC);

        LocalDate primeiroDiaMes = hoje.with(TemporalAdjusters.firstDayOfMonth());
        OffsetDateTime inicioMes = primeiroDiaMes.atStartOfDay().atOffset(ZoneOffset.UTC);

        int treinosSemana = (int) checkInRepository.countByAlunoIdAndStatusAndDataHoraBetween(
                aluno.getId(), StatusAcessoCheckin.LIBERADO, inicioSemana, fimHoje
        );

        int checkInsMes = (int) checkInRepository.countByAlunoIdAndStatusAndDataHoraBetween(
                aluno.getId(), StatusAcessoCheckin.LIBERADO, inicioMes, fimHoje
        );

        // Identificar ficha e próxima divisão
        String divisaoSugerida = "A";
        List<FichaTreino> fichas = fichaTreinoRepository.findByAlunoIdAndStatusWithDetails(aluno.getId(), StatusFicha.ATIVA);
        if (!fichas.isEmpty()) {
            divisaoSugerida = "Treino A / B";
        }

        // Matrícula ativa
        String statusMatricula = "SEM MATRÍCULA";
        LocalDate dataVencimentoMatricula = null;
        Optional<Matricula> matriculaOpt = matriculaRepository.findFirstByAlunoIdAndStatus(aluno.getId(), StatusMatricula.ATIVA);
        if (matriculaOpt.isPresent()) {
            statusMatricula = matriculaOpt.get().getStatus().name();
            dataVencimentoMatricula = matriculaOpt.get().getDataTermino();
        }

        // Próxima fatura
        ProximaFaturaDTO proximaFatura = null;
        List<Cobranca> faturasPendentes = cobrancaRepository.findByAlunoIdAndStatus(aluno.getId(), StatusCobranca.PENDENTE);
        if (!faturasPendentes.isEmpty()) {
            Cobranca prox = faturasPendentes.get(0);
            proximaFatura = new ProximaFaturaDTO(prox.getId(), prox.getValor(), prox.getDataVencimento(), prox.getStatus().name());
        }

        return new DashboardAlunoDTO(
                treinosSemana,
                checkInsMes,
                divisaoSugerida,
                statusMatricula,
                dataVencimentoMatricula,
                proximaFatura
        );
    }
}
