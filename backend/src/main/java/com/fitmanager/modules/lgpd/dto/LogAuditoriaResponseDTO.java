package com.fitmanager.modules.lgpd.dto;

import com.fitmanager.modules.lgpd.domain.LogAuditoriaLgpd;

import java.time.OffsetDateTime;

public record LogAuditoriaResponseDTO(
    Long id,
    String operadorNome,
    String titularNome,
    String acao,
    String detalhes,
    String ipOrigem,
    OffsetDateTime criadoEm
) {
    public static LogAuditoriaResponseDTO fromEntity(LogAuditoriaLgpd log) {
        return new LogAuditoriaResponseDTO(
            log.getId(),
            log.getOperador() != null ? log.getOperador().getNome() : "Sistema",
            log.getTitular() != null ? log.getTitular().getNome() : "N/A",
            log.getAcao(),
            log.getDetalhes(),
            log.getIpOrigem(),
            log.getCriadoEm()
        );
    }
}
