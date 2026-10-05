package com.fitmanager.modules.financeiro.domain;

import com.fitmanager.modules.auth.domain.Usuario;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_pagamento")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cobranca_id", nullable = false, unique = true)
    private Cobranca cobranca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_recebedor_id", nullable = false)
    private Usuario usuarioRecebedor;

    @Column(name = "valor_pago", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "forma_pagamento", nullable = false, length = 20)
    private FormaPagamento formaPagamento;

    @Column(name = "identificador_transacao", length = 100)
    private String identificadorTransacao;

    @CreationTimestamp
    @Column(name = "data_hora_pagamento", nullable = false, updatable = false)
    private OffsetDateTime dataHoraPagamento;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    public Pagamento() {}

    public Pagamento(Long id, Cobranca cobranca, Usuario usuarioRecebedor, BigDecimal valorPago, FormaPagamento formaPagamento, String identificadorTransacao, String observacao) {
        this.id = id;
        this.cobranca = cobranca;
        this.usuarioRecebedor = usuarioRecebedor;
        this.valorPago = valorPago;
        this.formaPagamento = formaPagamento;
        this.identificadorTransacao = identificadorTransacao;
        this.observacao = observacao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cobranca getCobranca() { return cobranca; }
    public void setCobranca(Cobranca cobranca) { this.cobranca = cobranca; }

    public Usuario getUsuarioRecebedor() { return usuarioRecebedor; }
    public void setUsuarioRecebedor(Usuario usuarioRecebedor) { this.usuarioRecebedor = usuarioRecebedor; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }

    public FormaPagamento getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(FormaPagamento formaPagamento) { this.formaPagamento = formaPagamento; }

    public String getIdentificadorTransacao() { return identificadorTransacao; }
    public void setIdentificadorTransacao(String identificadorTransacao) { this.identificadorTransacao = identificadorTransacao; }

    public OffsetDateTime getDataHoraPagamento() { return dataHoraPagamento; }
    public void setDataHoraPagamento(OffsetDateTime dataHoraPagamento) { this.dataHoraPagamento = dataHoraPagamento; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
