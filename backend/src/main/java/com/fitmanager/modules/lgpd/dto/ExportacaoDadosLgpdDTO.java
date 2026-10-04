package com.fitmanager.modules.lgpd.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

public record ExportacaoDadosLgpdDTO(
    String versaoExportacao,
    OffsetDateTime dataExportacao,
    Map<String, Object> titular,
    List<Map<String, Object>> consentimentos,
    List<Map<String, Object>> matriculas,
    List<Map<String, Object>> frequencias,
    List<Map<String, Object>> treinos,
    List<Map<String, Object>> historicoFinanceiro
) {}
