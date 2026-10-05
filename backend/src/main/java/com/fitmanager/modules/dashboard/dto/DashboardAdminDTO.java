package com.fitmanager.modules.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardAdminDTO(
    long totalAlunosAtivos,
    long totalAlunosInativos,
    BigDecimal faturamentoMesAtual,
    BigDecimal faturamentoMesAnterior,
    BigDecimal valorEmAtraso,
    double taxaInadimplencia,
    long checkInsHoje,
    long totalColaboradoresAtivos,
    List<FluxoHorarioDTO> fluxoPorHorario
) {}
