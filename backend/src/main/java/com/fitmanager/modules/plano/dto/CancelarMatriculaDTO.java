package com.fitmanager.modules.plano.dto;

import jakarta.validation.constraints.NotBlank;

public class CancelarMatriculaDTO {

    @NotBlank(message = "O motivo do cancelamento é obrigatório.")
    private String motivo;

    public CancelarMatriculaDTO() {}

    public CancelarMatriculaDTO(String motivo) {
        this.motivo = motivo;
    }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}
