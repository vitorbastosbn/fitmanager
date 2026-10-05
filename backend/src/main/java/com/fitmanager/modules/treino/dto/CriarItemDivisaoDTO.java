package com.fitmanager.modules.treino.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CriarItemDivisaoDTO {

    @NotNull(message = "O exercício é obrigatório.")
    private Long exercicioId;

    private Integer ordemExecucao = 1;

    @NotNull(message = "O número de séries é obrigatório.")
    @Min(value = 1, message = "O número de séries deve ser maior que zero.")
    private Integer series;

    @NotBlank(message = "As repetições são obrigatórias.")
    private String repeticoes;

    @NotNull(message = "A carga é obrigatória.")
    @DecimalMin(value = "0.0", message = "A carga não pode ser negativa.")
    private BigDecimal cargaKg = BigDecimal.ZERO;

    @NotNull(message = "O tempo de descanso é obrigatório.")
    @Min(value = 1, message = "O tempo de descanso deve ser maior que zero.")
    private Integer descansoSegundos;

    private String observacoes;

    public CriarItemDivisaoDTO() {}

    public Long getExercicioId() { return exercicioId; }
    public void setExercicioId(Long exercicioId) { this.exercicioId = exercicioId; }

    public Integer getOrdemExecucao() { return ordemExecucao; }
    public void setOrdemExecucao(Integer ordemExecucao) { this.ordemExecucao = ordemExecucao; }

    public Integer getSeries() { return series; }
    public void setSeries(Integer series) { this.series = series; }

    public String getRepeticoes() { return repeticoes; }
    public void setRepeticoes(String repeticoes) { this.repeticoes = repeticoes; }

    public BigDecimal getCargaKg() { return cargaKg; }
    public void setCargaKg(BigDecimal cargaKg) { this.cargaKg = cargaKg; }

    public Integer getDescansoSegundos() { return descansoSegundos; }
    public void setDescansoSegundos(Integer descansoSegundos) { this.descansoSegundos = descansoSegundos; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
