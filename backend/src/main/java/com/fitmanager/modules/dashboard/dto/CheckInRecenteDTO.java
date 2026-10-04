package com.fitmanager.modules.dashboard.dto;

import java.time.OffsetDateTime;

public record CheckInRecenteDTO(
    Long id,
    String alunoNome,
    String status,
    String motivo,
    OffsetDateTime dataHora
) {}
