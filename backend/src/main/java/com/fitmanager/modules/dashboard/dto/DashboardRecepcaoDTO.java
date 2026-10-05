package com.fitmanager.modules.dashboard.dto;

import java.util.List;

public record DashboardRecepcaoDTO(
    long checkInsHoje,
    long bloqueiosHoje,
    long faturasVencendoHoje,
    long matriculasVencendoEm7Dias,
    List<CheckInRecenteDTO> ultimosCheckIns
) {}
