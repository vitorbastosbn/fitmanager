package com.fitmanager.modules.treino.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tb_item_divisao")
public class ItemDivisao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "divisao_id", nullable = false)
    private DivisaoTreino divisao;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "exercicio_id", nullable = false)
    private Exercicio exercicio;

    @Column(name = "ordem_execucao", nullable = false)
    private Integer ordemExecucao = 1;

    @Column(nullable = false)
    private Integer series;

    @Column(nullable = false, length = 20)
    private String repeticoes;

    @Column(name = "carga_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal cargaKg = BigDecimal.ZERO;

    @Column(name = "descanso_segundos", nullable = false)
    private Integer descansoSegundos;

    @Column(length = 255)
    private String observacoes;

    public ItemDivisao() {}

    public ItemDivisao(Long id, DivisaoTreino divisao, Exercicio exercicio, Integer ordemExecucao, Integer series, String repeticoes, BigDecimal cargaKg, Integer descansoSegundos, String observacoes) {
        this.id = id;
        this.divisao = divisao;
        this.exercicio = exercicio;
        this.ordemExecucao = ordemExecucao != null ? ordemExecucao : 1;
        this.series = series;
        this.repeticoes = repeticoes;
        this.cargaKg = cargaKg != null ? cargaKg : BigDecimal.ZERO;
        this.descansoSegundos = descansoSegundos;
        this.observacoes = observacoes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DivisaoTreino getDivisao() { return divisao; }
    public void setDivisao(DivisaoTreino divisao) { this.divisao = divisao; }

    public Exercicio getExercicio() { return exercicio; }
    public void setExercicio(Exercicio exercicio) { this.exercicio = exercicio; }

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
