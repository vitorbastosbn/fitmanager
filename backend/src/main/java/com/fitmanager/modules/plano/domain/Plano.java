package com.fitmanager.modules.plano.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_plano")
public class Plano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "valor_mensalidade", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMensalidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PeriodicidadePlano periodicidade;

    @Column(nullable = false)
    private Boolean ativo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public Plano() {}

    public Plano(Long id, String nome, String descricao, BigDecimal valorMensalidade, PeriodicidadePlano periodicidade, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.valorMensalidade = valorMensalidade;
        this.periodicidade = periodicidade;
        this.ativo = ativo != null ? ativo : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValorMensalidade() { return valorMensalidade; }
    public void setValorMensalidade(BigDecimal valorMensalidade) { this.valorMensalidade = valorMensalidade; }

    public PeriodicidadePlano getPeriodicidade() { return periodicidade; }
    public void setPeriodicidade(PeriodicidadePlano periodicidade) { this.periodicidade = periodicidade; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
