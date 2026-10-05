package com.fitmanager.modules.treino.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_exercicio")
public class Exercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "grupo_muscular", nullable = false, length = 20)
    private GrupoMuscular grupoMuscular;

    @Column(columnDefinition = "TEXT")
    private String instrucoes;

    @Column(nullable = false)
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public Exercicio() {}

    public Exercicio(Long id, String nome, GrupoMuscular grupoMuscular, String instrucoes, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.grupoMuscular = grupoMuscular;
        this.instrucoes = instrucoes;
        this.ativo = ativo != null ? ativo : true;
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

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
