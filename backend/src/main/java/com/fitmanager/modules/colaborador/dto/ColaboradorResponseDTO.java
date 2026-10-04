package com.fitmanager.modules.colaborador.dto;

import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.domain.Colaborador;
import com.fitmanager.modules.colaborador.domain.TurnoTrabalho;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record ColaboradorResponseDTO(
    Long id,
    Long usuarioId,
    String nome,
    String cpf,
    String email,
    String telefone,
    CargoPerfil cargoPerfil,
    String cref,
    TurnoTrabalho turno,
    LocalDate dataAdmissao,
    boolean ativo,
    OffsetDateTime criadoEm
) {
    public static ColaboradorResponseDTO fromEntity(Colaborador c) {
        return new ColaboradorResponseDTO(
            c.getId(),
            c.getUsuarioId(),
            c.getNome(),
            c.getCpf(),
            c.getEmail(),
            c.getTelefone(),
            c.getCargoPerfil(),
            c.getCref(),
            c.getTurno(),
            c.getDataAdmissao(),
            c.isAtivo(),
            c.getCriadoEm()
        );
    }
}
