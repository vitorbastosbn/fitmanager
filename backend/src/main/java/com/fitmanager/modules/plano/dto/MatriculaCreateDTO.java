package com.fitmanager.modules.plano.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class MatriculaCreateDTO {

    @NotNull(message = "O ID do aluno é obrigatório.")
    private Long alunoId;

    @NotNull(message = "O ID do plano é obrigatório.")
    private Long planoId;

    @NotNull(message = "A data de início é obrigatória.")
    private LocalDate dataInicio;

    public MatriculaCreateDTO() {}

    public MatriculaCreateDTO(Long alunoId, Long planoId, LocalDate dataInicio) {
        this.alunoId = alunoId;
        this.planoId = planoId;
        this.dataInicio = dataInicio;
    }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public Long getPlanoId() { return planoId; }
    public void setPlanoId(Long planoId) { this.planoId = planoId; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
}
