package com.fitmanager.modules.treino.dto;

import com.fitmanager.modules.treino.domain.GrupoMuscular;
import com.fitmanager.modules.treino.domain.ItemDivisao;

import java.math.BigDecimal;

public class ItemDivisaoDTO {
    private Long id;
    private Long exercicioId;
    private String exercicioNome;
    private GrupoMuscular grupoMuscular;
    private Integer ordemExecucao;
    private Integer series;
    private String repeticoes;
    private BigDecimal cargaKg;
    private Integer descansoSegundos;
    private String observacoes;

    public ItemDivisaoDTO() {}

    public static ItemDivisaoDTO fromEntity(ItemDivisao i) {
        ItemDivisaoDTO dto = new ItemDivisaoDTO();
        dto.setId(i.getId());
        dto.setExercicioId(i.getExercicio().getId());
        dto.setExercicioNome(i.getExercicio().getNome());
        dto.setGrupoMuscular(i.getExercicio().getGrupoMuscular());
        dto.setOrdemExecucao(i.getOrdemExecucao());
        dto.setSeries(i.getSeries());
        dto.setRepeticoes(i.getRepeticoes());
        dto.setCargaKg(i.getCargaKg());
        dto.setDescansoSegundos(i.getDescansoSegundos());
        dto.setObservacoes(i.getObservacoes());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getExercicioId() { return exercicioId; }
    public void setExercicioId(Long exercicioId) { this.exercicioId = exercicioId; }

    public String getExercicioNome() { return exercicioNome; }
    public void setExercicioNome(String exercicioNome) { this.exercicioNome = exercicioNome; }

    public GrupoMuscular getGrupoMuscular() { return grupoMuscular; }
    public void setGrupoMuscular(GrupoMuscular grupoMuscular) { this.grupoMuscular = grupoMuscular; }

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
