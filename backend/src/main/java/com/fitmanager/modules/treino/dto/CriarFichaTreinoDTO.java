package com.fitmanager.modules.treino.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CriarFichaTreinoDTO {

    @NotNull(message = "O ID do aluno é obrigatório.")
    private Long alunoId;

    @NotBlank(message = "O objetivo do treino é obrigatório.")
    private String objetivo;

    @NotNull(message = "A data de início é obrigatória.")
    private LocalDate dataInicio;

    private LocalDate dataValidade;

    @Valid
    @NotEmpty(message = "A ficha de treino deve conter pelo menos uma divisão.")
    private List<CriarDivisaoDTO> divisoes = new ArrayList<>();

    public CriarFichaTreinoDTO() {}

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }

    public List<CriarDivisaoDTO> getDivisoes() { return divisoes; }
    public void setDivisoes(List<CriarDivisaoDTO> divisoes) { this.divisoes = divisoes; }
}
