package com.fitmanager.modules.colaborador.dto;

import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.domain.TurnoTrabalho;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record CriarColaboradorDTO(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve conter exatamente 11 dígitos numéricos")
    String cpf,

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    String email,

    @NotBlank(message = "Telefone é obrigatório")
    String telefone,

    @NotNull(message = "Cargo/Perfil é obrigatório")
    CargoPerfil cargoPerfil,

    String cref,

    TurnoTrabalho turno,

    LocalDate dataAdmissao
) {}
