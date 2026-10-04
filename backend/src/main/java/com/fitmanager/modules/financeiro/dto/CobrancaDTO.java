package com.fitmanager.modules.financeiro.dto;

import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CobrancaDTO {
    private Long id;
    private Long matriculaId;
    private Long alunoId;
    private String alunoNome;
    private BigDecimal valor;
    private LocalDate dataVencimento;
    private StatusCobranca status;

    public CobrancaDTO() {}

    public CobrancaDTO(Long id, Long matriculaId, Long alunoId, String alunoNome, BigDecimal valor, LocalDate dataVencimento, StatusCobranca status) {
        this.id = id;
        this.matriculaId = matriculaId;
        this.alunoId = alunoId;
        this.alunoNome = alunoNome;
        this.valor = valor;
        this.dataVencimento = dataVencimento;
        this.status = status;
    }

    public static CobrancaDTO fromEntity(Cobranca c) {
        return new CobrancaDTO(
                c.getId(),
                c.getMatricula().getId(),
                c.getMatricula().getAluno().getId(),
                c.getMatricula().getAluno().getNome(),
                c.getValor(),
                c.getDataVencimento(),
                c.getStatus()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatriculaId() { return matriculaId; }
    public void setMatriculaId(Long matriculaId) { this.matriculaId = matriculaId; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public String getAlunoNome() { return alunoNome; }
    public void setAlunoNome(String alunoNome) { this.alunoNome = alunoNome; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public StatusCobranca getStatus() { return status; }
    public void setStatus(StatusCobranca status) { this.status = status; }
}
