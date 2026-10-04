package com.fitmanager.modules.treino.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

public class CriarDivisaoDTO {

    @NotBlank(message = "A letra da divisão é obrigatória (ex: A, B, C).")
    private String letra;

    @NotBlank(message = "O nome da divisão é obrigatório (ex: Peito e Tríceps).")
    private String nome;

    private Integer ordem = 1;

    @Valid
    @NotEmpty(message = "A divisão deve conter pelo menos um exercício.")
    private List<CriarItemDivisaoDTO> itens = new ArrayList<>();

    public CriarDivisaoDTO() {}

    public String getLetra() { return letra; }
    public void setLetra(String letra) { this.letra = letra; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }

    public List<CriarItemDivisaoDTO> getItens() { return itens; }
    public void setItens(List<CriarItemDivisaoDTO> itens) { this.itens = itens; }
}
