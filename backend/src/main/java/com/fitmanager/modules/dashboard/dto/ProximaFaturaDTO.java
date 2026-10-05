package com.fitmanager.modules.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProximaFaturaDTO(
    Long id,
    BigDecimal valor,
    LocalDate dataVencimento,
    String status
) {}
