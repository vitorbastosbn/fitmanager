package com.fitmanager.modules.dashboard.dto;

import java.time.LocalDate;

public record FichaPendenteDTO(
    Long alunoId,
    String alunoNome,
    LocalDate dataMatricula
) {}
