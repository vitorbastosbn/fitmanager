package com.fitmanager.modules.dashboard.dto;

import java.util.List;

public record DashboardInstrutorDTO(
    long totalAlunosAtivos,
    long totalFichasPrescritas,
    long alunosSemFichaTreino,
    List<FichaPendenteDTO> listaAlunosPendentes
) {}
