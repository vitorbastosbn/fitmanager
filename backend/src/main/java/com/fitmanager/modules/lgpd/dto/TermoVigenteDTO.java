package com.fitmanager.modules.lgpd.dto;

public record TermoVigenteDTO(
    Long id,
    String versao,
    String titulo,
    String conteudo,
    boolean obrigatorio,
    boolean jaAceito
) {}
