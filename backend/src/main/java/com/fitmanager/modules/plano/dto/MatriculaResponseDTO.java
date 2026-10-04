package com.fitmanager.modules.plano.dto;

import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.StatusMatricula;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public class MatriculaResponseDTO {
    private Long id;
    private Long alunoId;
    private String alunoNome;
    private Long planoId;
    private String planoNome;
    private LocalDate dataInicio;
    private LocalDate dataTermino;
    private BigDecimal valorMensalidadeContratada;
    private StatusMatricula status;
    private OffsetDateTime dataCancelamento;
    private String motivoCancelamento;

    public MatriculaResponseDTO() {}

    public MatriculaResponseDTO(Long id, Long alunoId, String alunoNome, Long planoId, String planoNome, LocalDate dataInicio, LocalDate dataTermino, BigDecimal valorMensalidadeContratada, StatusMatricula status, OffsetDateTime dataCancelamento, String motivoCancelamento) {
        this.id = id;
        this.alunoId = alunoId;
        this.alunoNome = alunoNome;
        this.planoId = planoId;
        this.planoNome = planoNome;
        this.dataInicio = dataInicio;
        this.dataTermino = dataTermino;
        this.valorMensalidadeContratada = valorMensalidadeContratada;
        this.status = status;
        this.dataCancelamento = dataCancelamento;
        this.motivoCancelamento = motivoCancelamento;
    }

    public static MatriculaResponseDTO fromEntity(Matricula m) {
        return new MatriculaResponseDTO(
                m.getId(),
                m.getAluno().getId(),
                m.getAluno().getNome(),
                m.getPlano().getId(),
                m.getPlano().getNome(),
                m.getDataInicio(),
                m.getDataTermino(),
                m.getValorMensalidadeContratada(),
                m.getStatus(),
                m.getDataCancelamento(),
                m.getMotivoCancelamento()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public String getAlunoNome() { return alunoNome; }
    public void setAlunoNome(String alunoNome) { this.alunoNome = alunoNome; }

    public Long getPlanoId() { return planoId; }
    public void setPlanoId(Long planoId) { this.planoId = planoId; }

    public String getPlanoNome() { return planoNome; }
    public void setPlanoNome(String planoNome) { this.planoNome = planoNome; }

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
}
