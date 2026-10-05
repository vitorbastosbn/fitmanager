package com.fitmanager.modules.treino.dto;

import com.fitmanager.modules.treino.domain.Exercicio;
import com.fitmanager.modules.treino.domain.GrupoMuscular;

public class ExercicioDTO {
    private Long id;
    private String nome;
    private GrupoMuscular grupoMuscular;
    private String instrucoes;
    private Boolean ativo;

    public ExercicioDTO() {}

    public ExercicioDTO(Long id, String nome, GrupoMuscular grupoMuscular, String instrucoes, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.grupoMuscular = grupoMuscular;
        this.instrucoes = instrucoes;
        this.ativo = ativo;
    }

    public static ExercicioDTO fromEntity(Exercicio e) {
        return new ExercicioDTO(
                e.getId(),
                e.getNome(),
                e.getGrupoMuscular(),
                e.getInstrucoes(),
                e.getAtivo()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public GrupoMuscular getGrupoMuscular() { return grupoMuscular; }
    public void setGrupoMuscular(GrupoMuscular grupoMuscular) { this.grupoMuscular = grupoMuscular; }

    public String getInstrucoes() { return instrucoes; }
    public void setInstrucoes(String instrucoes) { this.instrucoes = instrucoes; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
