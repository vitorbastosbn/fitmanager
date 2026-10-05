package com.fitmanager.modules.treino.domain;

import com.fitmanager.modules.aluno.domain.Aluno;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_registro_execucao_treino")
public class RegistroExecucaoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_divisao_id", nullable = false)
    private ItemDivisao itemDivisao;

    @CreationTimestamp
    @Column(name = "data_hora_execucao", nullable = false, updatable = false)
    private OffsetDateTime dataHoraExecucao;

    @Column(name = "carga_utilizada_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal cargaUtilizadaKg;

    @Column(name = "repeticoes_realizadas", nullable = false)
    private Integer repeticoesRealizadas;

    @Column(name = "series_concluidas", nullable = false)
    private Integer seriesConcluidas;

    @Column(length = 255)
    private String observacoes;

    public RegistroExecucaoTreino() {}

    public RegistroExecucaoTreino(Long id, Aluno aluno, ItemDivisao itemDivisao, BigDecimal cargaUtilizadaKg, Integer repeticoesRealizadas, Integer seriesConcluidas, String observacoes) {
        this.id = id;
        this.aluno = aluno;
        this.itemDivisao = itemDivisao;
        this.cargaUtilizadaKg = cargaUtilizadaKg;
        this.repeticoesRealizadas = repeticoesRealizadas;
        this.seriesConcluidas = seriesConcluidas;
        this.observacoes = observacoes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public ItemDivisao getItemDivisao() { return itemDivisao; }
    public void setItemDivisao(ItemDivisao itemDivisao) { this.itemDivisao = itemDivisao; }

    public OffsetDateTime getDataHoraExecucao() { return dataHoraExecucao; }
    public void setDataHoraExecucao(OffsetDateTime dataHoraExecucao) { this.dataHoraExecucao = dataHoraExecucao; }

    public BigDecimal getCargaUtilizadaKg() { return cargaUtilizadaKg; }
    public void setCargaUtilizadaKg(BigDecimal cargaUtilizadaKg) { this.cargaUtilizadaKg = cargaUtilizadaKg; }

    public Integer getRepeticoesRealizadas() { return repeticoesRealizadas; }
    public void setRepeticoesRealizadas(Integer repeticoesRealizadas) { this.repeticoesRealizadas = repeticoesRealizadas; }

    public Integer getSeriesConcluidas() { return seriesConcluidas; }
    public void setSeriesConcluidas(Integer seriesConcluidas) { this.seriesConcluidas = seriesConcluidas; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
