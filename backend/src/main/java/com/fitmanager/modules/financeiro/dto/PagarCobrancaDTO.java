package com.fitmanager.modules.financeiro.dto;

import com.fitmanager.modules.financeiro.domain.FormaPagamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PagarCobrancaDTO {

    @NotNull(message = "A forma de pagamento é obrigatória.")
    private FormaPagamento formaPagamento;

    @NotNull(message = "O valor pago é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor pago deve ser positivo.")
    private BigDecimal valorPago;

    private String identificadorTransacao;

    private String observacao;

    public PagarCobrancaDTO() {}

    public PagarCobrancaDTO(FormaPagamento formaPagamento, BigDecimal valorPago, String identificadorTransacao, String observacao) {
        this.formaPagamento = formaPagamento;
        this.valorPago = valorPago;
        this.identificadorTransacao = identificadorTransacao;
        this.observacao = observacao;
    }

    public FormaPagamento getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(FormaPagamento formaPagamento) { this.formaPagamento = formaPagamento; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }

    public String getIdentificadorTransacao() { return identificadorTransacao; }
    public void setIdentificadorTransacao(String identificadorTransacao) { this.identificadorTransacao = identificadorTransacao; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
