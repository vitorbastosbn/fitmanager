package com.fitmanager.modules.plano.domain;

import com.fitmanager.modules.aluno.domain.Aluno;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_matricula")
public class Matricula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plano_id", nullable = false)
    private Plano plano;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_termino", nullable = false)
    private LocalDate dataTermino;

    @Column(name = "valor_mensalidade_contratada", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMensalidadeContratada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusMatricula status = StatusMatricula.ATIVA;

    @Column(name = "data_cancelamento")
    private OffsetDateTime dataCancelamento;

    @Column(name = "motivo_cancelamento", columnDefinition = "TEXT")
    private String motivoCancelamento;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public Matricula() {}

    public Matricula(Long id, Aluno aluno, Plano plano, LocalDate dataInicio, LocalDate dataTermino, BigDecimal valorMensalidadeContratada, StatusMatricula status) {
        this.id = id;
        this.aluno = aluno;
        this.plano = plano;
        this.dataInicio = dataInicio;
        this.dataTermino = dataTermino;
        this.valorMensalidadeContratada = valorMensalidadeContratada;
        this.status = status != null ? status : StatusMatricula.ATIVA;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public Plano getPlano() { return plano; }
    public void setPlano(Plano plano) { this.plano = plano; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataTermino() { return dataTermino; }
    public void setDataTermino(LocalDate dataTermino) { this.dataTermino = dataTermino; }

    public BigDecimal getValorMensalidadeContratada() { return valorMensalidadeContratada; }
    public void setValorMensalidadeContratada(BigDecimal valorMensalidadeContratada) { this.valorMensalidadeContratada = valorMensalidadeContratada; }

    public StatusMatricula getStatus() { return status; }
    public void setStatus(StatusMatricula status) { this.status = status; }

    public OffsetDateTime getDataCancelamento() { return dataCancelamento; }
    public void setDataCancelamento(OffsetDateTime dataCancelamento) { this.dataCancelamento = dataCancelamento; }

    public String getMotivoCancelamento() { return motivoCancelamento; }
    public void setMotivoCancelamento(String motivoCancelamento) { this.motivoCancelamento = motivoCancelamento; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
