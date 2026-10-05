package com.fitmanager.modules.colaborador.dto;

import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.domain.TurnoTrabalho;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtualizarColaboradorDTO(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    String email,

    @NotBlank(message = "Telefone é obrigatório")
    String telefone,

    @NotNull(message = "Cargo/Perfil é obrigatório")
    CargoPerfil cargoPerfil,

    String cref,

    TurnoTrabalho turno
) {}
