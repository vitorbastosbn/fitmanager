package com.fitmanager.modules.treino.dto;

import com.fitmanager.modules.treino.domain.RegistroExecucaoTreino;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class RegistroExecucaoResponseDTO {
    private Long id;
    private Long alunoId;
    private Long itemDivisaoId;
    private String exercicioNome;
    private OffsetDateTime dataHoraExecucao;
    private BigDecimal cargaUtilizadaKg;
    private Integer repeticoesRealizadas;
    private Integer seriesConcluidas;

    public RegistroExecucaoResponseDTO() {}

    public static RegistroExecucaoResponseDTO fromEntity(RegistroExecucaoTreino r) {
        RegistroExecucaoResponseDTO dto = new RegistroExecucaoResponseDTO();
        dto.setId(r.getId());
        dto.setAlunoId(r.getAluno().getId());
        dto.setItemDivisaoId(r.getItemDivisao().getId());
        dto.setExercicioNome(r.getItemDivisao().getExercicio().getNome());
        dto.setDataHoraExecucao(r.getDataHoraExecucao());
        dto.setCargaUtilizadaKg(r.getCargaUtilizadaKg());
        dto.setRepeticoesRealizadas(r.getRepeticoesRealizadas());
        dto.setSeriesConcluidas(r.getSeriesConcluidas());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public Long getItemDivisaoId() { return itemDivisaoId; }
    public void setItemDivisaoId(Long itemDivisaoId) { this.itemDivisaoId = itemDivisaoId; }

    public String getExercicioNome() { return exercicioNome; }
    public void setExercicioNome(String exercicioNome) { this.exercicioNome = exercicioNome; }

    public OffsetDateTime getDataHoraExecucao() { return dataHoraExecucao; }
    public void setDataHoraExecucao(OffsetDateTime dataHoraExecucao) { this.dataHoraExecucao = dataHoraExecucao; }

    public BigDecimal getCargaUtilizadaKg() { return cargaUtilizadaKg; }
    public void setCargaUtilizadaKg(BigDecimal cargaUtilizadaKg) { this.cargaUtilizadaKg = cargaUtilizadaKg; }

    public Integer getRepeticoesRealizadas() { return repeticoesRealizadas; }
    public void setRepeticoesRealizadas(Integer repeticoesRealizadas) { this.repeticoesRealizadas = repeticoesRealizadas; }

    public Integer getSeriesConcluidas() { return seriesConcluidas; }
    public void setSeriesConcluidas(Integer seriesConcluidas) { this.seriesConcluidas = seriesConcluidas; }
}
