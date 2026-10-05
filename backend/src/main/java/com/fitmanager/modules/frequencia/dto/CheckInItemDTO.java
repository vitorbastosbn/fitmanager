package com.fitmanager.modules.frequencia.dto;

import com.fitmanager.modules.frequencia.domain.CheckIn;
import com.fitmanager.modules.frequencia.domain.StatusAcessoCheckin;

import java.time.OffsetDateTime;

public class CheckInItemDTO {
    private Long id;
    private Long alunoId;
    private String alunoNome;
    private OffsetDateTime dataHora;
    private StatusAcessoCheckin status;
    private String motivoBloqueio;

    public CheckInItemDTO() {}

    public CheckInItemDTO(Long id, Long alunoId, String alunoNome, OffsetDateTime dataHora, StatusAcessoCheckin status, String motivoBloqueio) {
        this.id = id;
        this.alunoId = alunoId;
        this.alunoNome = alunoNome;
        this.dataHora = dataHora;
        this.status = status;
        this.motivoBloqueio = motivoBloqueio;
    }

    public static CheckInItemDTO fromEntity(CheckIn c) {
        return new CheckInItemDTO(
                c.getId(),
                c.getAluno().getId(),
                c.getAluno().getNome(),
                c.getDataHora(),
                c.getStatus(),
                c.getMotivoBloqueio()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public String getAlunoNome() { return alunoNome; }
    public void setAlunoNome(String alunoNome) { this.alunoNome = alunoNome; }

    public OffsetDateTime getDataHora() { return dataHora; }
    public void setDataHora(OffsetDateTime dataHora) { this.dataHora = dataHora; }

    public StatusAcessoCheckin getStatus() { return status; }
    public void setStatus(StatusAcessoCheckin status) { this.status = status; }

    public String getMotivoBloqueio() { return motivoBloqueio; }
    public void setMotivoBloqueio(String motivoBloqueio) { this.motivoBloqueio = motivoBloqueio; }
}
