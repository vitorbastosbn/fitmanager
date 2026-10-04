package com.fitmanager.modules.frequencia.dto;

import com.fitmanager.modules.frequencia.domain.StatusAcessoCheckin;

import java.time.OffsetDateTime;

public class CheckInResponseDTO {
    private StatusAcessoCheckin status;
    private Long alunoId;
    private String alunoNome;
    private OffsetDateTime dataHora;
    private String planoNome;
    private String motivo;
    private String mensagem;

    public CheckInResponseDTO() {}

    public static CheckInResponseDTO liberado(Long alunoId, String alunoNome, OffsetDateTime dataHora, String planoNome) {
        CheckInResponseDTO dto = new CheckInResponseDTO();
        dto.setStatus(StatusAcessoCheckin.LIBERADO);
        dto.setAlunoId(alunoId);
        dto.setAlunoNome(alunoNome);
        dto.setDataHora(dataHora);
        dto.setPlanoNome(planoNome);
        dto.setMensagem("Entrada autorizada. Bom treino!");
        return dto;
    }

    public static CheckInResponseDTO bloqueado(Long alunoId, String alunoNome, String motivo, String mensagem) {
        CheckInResponseDTO dto = new CheckInResponseDTO();
        dto.setStatus(StatusAcessoCheckin.BLOQUEADO);
        dto.setAlunoId(alunoId);
        dto.setAlunoNome(alunoNome);
        dto.setDataHora(OffsetDateTime.now());
        dto.setMotivo(motivo);
        dto.setMensagem(mensagem);
        return dto;
    }

    public StatusAcessoCheckin getStatus() { return status; }
    public void setStatus(StatusAcessoCheckin status) { this.status = status; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public String getAlunoNome() { return alunoNome; }
    public void setAlunoNome(String alunoNome) { this.alunoNome = alunoNome; }

    public OffsetDateTime getDataHora() { return dataHora; }
    public void setDataHora(OffsetDateTime dataHora) { this.dataHora = dataHora; }

    public String getPlanoNome() { return planoNome; }
    public void setPlanoNome(String planoNome) { this.planoNome = planoNome; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
}
