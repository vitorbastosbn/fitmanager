package com.fitmanager.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AlterarSenhaPrimeiroAcessoDTO {

    @NotBlank(message = "A nova senha é obrigatória.")
    @Size(min = 6, message = "A senha deve conter no mínimo 6 caracteres.")
    private String novaSenha;

    @NotBlank(message = "A confirmação de senha é obrigatória.")
    private String confirmacaoNovaSenha;

    public AlterarSenhaPrimeiroAcessoDTO() {}

    public AlterarSenhaPrimeiroAcessoDTO(String novaSenha, String confirmacaoNovaSenha) {
        this.novaSenha = novaSenha;
        this.confirmacaoNovaSenha = confirmacaoNovaSenha;
    }

    public String getNovaSenha() { return novaSenha; }
    public void setNovaSenha(String novaSenha) { this.novaSenha = novaSenha; }

    public String getConfirmacaoNovaSenha() { return confirmacaoNovaSenha; }
    public void setConfirmacaoNovaSenha(String confirmacaoNovaSenha) { this.confirmacaoNovaSenha = confirmacaoNovaSenha; }
}
