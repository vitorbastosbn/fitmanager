package com.fitmanager.modules.frequencia.dto;

import jakarta.validation.constraints.NotBlank;

public class CheckInRequestDTO {

    @NotBlank(message = "O token do QR Code é obrigatório.")
    private String token;

    public CheckInRequestDTO() {}

    public CheckInRequestDTO(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
