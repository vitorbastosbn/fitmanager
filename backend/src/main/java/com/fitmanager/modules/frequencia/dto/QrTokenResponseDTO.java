package com.fitmanager.modules.frequencia.dto;

import java.time.OffsetDateTime;

public class QrTokenResponseDTO {
    private String token;
    private int segundosValidade;
    private OffsetDateTime geradoEm;

    public QrTokenResponseDTO() {}

    public QrTokenResponseDTO(String token, int segundosValidade, OffsetDateTime geradoEm) {
        this.token = token;
        this.segundosValidade = segundosValidade;
        this.geradoEm = geradoEm;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public int getSegundosValidade() { return segundosValidade; }
    public void setSegundosValidade(int segundosValidade) { this.segundosValidade = segundosValidade; }

    public OffsetDateTime getGeradoEm() { return geradoEm; }
    public void setGeradoEm(OffsetDateTime geradoEm) { this.geradoEm = geradoEm; }
}
