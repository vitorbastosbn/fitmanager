package com.fitmanager.modules.auth.dto;

public class TokenResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UsuarioDTO usuario;

    public TokenResponseDTO() {}

    public TokenResponseDTO(String accessToken, String tokenType, Long expiresIn, UsuarioDTO usuario) {
        this.accessToken = accessToken;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.expiresIn = expiresIn;
        this.usuario = usuario;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }

    public UsuarioDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioDTO usuario) { this.usuario = usuario; }
}
