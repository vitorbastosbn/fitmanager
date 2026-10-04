package com.fitmanager.modules.dashboard.dto;

import java.time.LocalDate;

public record DashboardAlunoDTO(
    int treinosSemanaAtual,
    int totalCheckInsMes,
    String proximaDivisaoSugerida,
    String statusMatricula,
    LocalDate dataVencimentoMatricula,
    ProximaFaturaDTO proximaFatura
) {}
