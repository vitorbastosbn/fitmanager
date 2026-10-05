package com.fitmanager.modules.treino.dto;

import com.fitmanager.modules.treino.domain.DivisaoTreino;

import java.util.ArrayList;
import java.util.List;

public class DivisaoTreinoDTO {
    private Long id;
    private String letra;
    private String nome;
    private Integer ordem;
    private List<ItemDivisaoDTO> itens = new ArrayList<>();

    public DivisaoTreinoDTO() {}

    public static DivisaoTreinoDTO fromEntity(DivisaoTreino d) {
        DivisaoTreinoDTO dto = new DivisaoTreinoDTO();
        dto.setId(d.getId());
        dto.setLetra(d.getLetra());
        dto.setNome(d.getNome());
        dto.setOrdem(d.getOrdem());
        if (d.getItens() != null) {
            dto.setItens(d.getItens().stream().map(ItemDivisaoDTO::fromEntity).toList());
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLetra() { return letra; }
    public void setLetra(String letra) { this.letra = letra; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }

    public List<ItemDivisaoDTO> getItens() { return itens; }
    public void setItens(List<ItemDivisaoDTO> itens) { this.itens = itens; }
}
