package com.fitmanager.modules.plano.dto;

import com.fitmanager.modules.plano.domain.PeriodicidadePlano;
import com.fitmanager.modules.plano.domain.Plano;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PlanoDTO {
    private Long id;

    @NotBlank(message = "O nome do plano é obrigatório.")
    private String nome;

    private String descricao;

    @NotNull(message = "O valor da mensalidade é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor da mensalidade deve ser maior que zero.")
    private BigDecimal valorMensalidade;

    @NotNull(message = "A periodicidade é obrigatória.")
    private PeriodicidadePlano periodicidade;

    private Boolean ativo = true;

    public PlanoDTO() {}

    public PlanoDTO(Long id, String nome, String descricao, BigDecimal valorMensalidade, PeriodicidadePlano periodicidade, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.valorMensalidade = valorMensalidade;
        this.periodicidade = periodicidade;
        this.ativo = ativo != null ? ativo : true;
    }

    public static PlanoDTO fromEntity(Plano plano) {
        return new PlanoDTO(
                plano.getId(),
                plano.getNome(),
                plano.getDescricao(),
                plano.getValorMensalidade(),
                plano.getPeriodicidade(),
                plano.getAtivo()
        );
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
}
