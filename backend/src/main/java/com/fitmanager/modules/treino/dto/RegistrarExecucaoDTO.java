package com.fitmanager.modules.treino.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RegistrarExecucaoDTO {

    @NotNull(message = "O item da divisão é obrigatório.")
    private Long itemDivisaoId;

    @NotNull(message = "A carga utilizada é obrigatória.")
    @DecimalMin(value = "0.0", message = "A carga utilizada não pode ser negativa.")
    private BigDecimal cargaUtilizadaKg;

    @NotNull(message = "As repetições realizadas são obrigatórias.")
    @Min(value = 1, message = "As repetições realizadas devem ser maiores que zero.")
    private Integer repeticoesRealizadas;

    @NotNull(message = "As séries concluídas são obrigatórias.")
    @Min(value = 1, message = "As séries concluídas devem ser maiores que zero.")
    private Integer seriesConcluidas;

    private String observacoes;

    public RegistrarExecucaoDTO() {}

    public Long getItemDivisaoId() { return itemDivisaoId; }
    public void setItemDivisaoId(Long itemDivisaoId) { this.itemDivisaoId = itemDivisaoId; }

    public BigDecimal getCargaUtilizadaKg() { return cargaUtilizadaKg; }
    public void setCargaUtilizadaKg(BigDecimal cargaUtilizadaKg) { this.cargaUtilizadaKg = cargaUtilizadaKg; }

    public Integer getRepeticoesRealizadas() { return repeticoesRealizadas; }
    public void setRepeticoesRealizadas(Integer repeticoesRealizadas) { this.repeticoesRealizadas = repeticoesRealizadas; }

    public Integer getSeriesConcluidas() { return seriesConcluidas; }
    public void setSeriesConcluidas(Integer seriesConcluidas) { this.seriesConcluidas = seriesConcluidas; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
