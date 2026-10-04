package com.fitmanager.modules.financeiro.dto;

import com.fitmanager.modules.financeiro.domain.FormaPagamento;
import com.fitmanager.modules.financeiro.domain.Pagamento;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class PagamentoResponseDTO {
    private Long pagamentoId;
    private Long cobrancaId;
    private StatusCobranca statusCobranca;
    private BigDecimal valorPago;
    private FormaPagamento formaPagamento;
    private OffsetDateTime dataHoraPagamento;
    private String recebedorNome;
    private String identificadorTransacao;

    public PagamentoResponseDTO() {}

    public PagamentoResponseDTO(Long pagamentoId, Long cobrancaId, StatusCobranca statusCobranca, BigDecimal valorPago, FormaPagamento formaPagamento, OffsetDateTime dataHoraPagamento, String recebedorNome, String identificadorTransacao) {
        this.pagamentoId = pagamentoId;
        this.cobrancaId = cobrancaId;
        this.statusCobranca = statusCobranca;
        this.valorPago = valorPago;
        this.formaPagamento = formaPagamento;
        this.dataHoraPagamento = dataHoraPagamento;
        this.recebedorNome = recebedorNome;
        this.identificadorTransacao = identificadorTransacao;
    }

    public static PagamentoResponseDTO fromEntity(Pagamento p) {
        return new PagamentoResponseDTO(
                p.getId(),
                p.getCobranca().getId(),
                p.getCobranca().getStatus(),
                p.getValorPago(),
                p.getFormaPagamento(),
                p.getDataHoraPagamento(),
                p.getUsuarioRecebedor().getNome(),
                p.getIdentificadorTransacao()
        );
    }

    public Long getPagamentoId() { return pagamentoId; }
    public void setPagamentoId(Long pagamentoId) { this.pagamentoId = pagamentoId; }

    public Long getCobrancaId() { return cobrancaId; }
    public void setCobrancaId(Long cobrancaId) { this.cobrancaId = cobrancaId; }

    public StatusCobranca getStatusCobranca() { return statusCobranca; }
    public void setStatusCobranca(StatusCobranca statusCobranca) { this.statusCobranca = statusCobranca; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }

    public FormaPagamento getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(FormaPagamento formaPagamento) { this.formaPagamento = formaPagamento; }

    public OffsetDateTime getDataHoraPagamento() { return dataHoraPagamento; }
    public void setDataHoraPagamento(OffsetDateTime dataHoraPagamento) { this.dataHoraPagamento = dataHoraPagamento; }

    public String getRecebedorNome() { return recebedorNome; }
    public void setRecebedorNome(String recebedorNome) { this.recebedorNome = recebedorNome; }

    public String getIdentificadorTransacao() { return identificadorTransacao; }
    public void setIdentificadorTransacao(String identificadorTransacao) { this.identificadorTransacao = identificadorTransacao; }
}
