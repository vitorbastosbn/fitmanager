package com.fitmanager.modules.financeiro.domain;

import com.fitmanager.modules.plano.domain.Matricula;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_cobranca")
public class Cobranca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matricula_id", nullable = false)
    private Matricula matricula;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCobranca status = StatusCobranca.PENDENTE;

    @OneToOne(mappedBy = "cobranca", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Pagamento pagamento;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public Cobranca() {}

    public Cobranca(Long id, Matricula matricula, BigDecimal valor, LocalDate dataVencimento, StatusCobranca status) {
        this.id = id;
        this.matricula = matricula;
        this.valor = valor;
        this.dataVencimento = dataVencimento;
        this.status = status != null ? status : StatusCobranca.PENDENTE;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Matricula getMatricula() { return matricula; }
    public void setMatricula(Matricula matricula) { this.matricula = matricula; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public StatusCobranca getStatus() { return status; }
    public void setStatus(StatusCobranca status) { this.status = status; }

    public Pagamento getPagamento() { return pagamento; }
    public void setPagamento(Pagamento pagamento) { this.pagamento = pagamento; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
