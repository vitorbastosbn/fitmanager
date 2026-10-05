package com.fitmanager.modules.treino.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_divisao_treino")
public class DivisaoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ficha_id", nullable = false)
    private FichaTreino ficha;

    @Column(nullable = false, length = 2)
    private String letra;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false)
    private Integer ordem = 1;

    @OneToMany(mappedBy = "divisao", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordemExecucao ASC")
    private List<ItemDivisao> itens = new ArrayList<>();

    public DivisaoTreino() {}

    public DivisaoTreino(Long id, FichaTreino ficha, String letra, String nome, Integer ordem) {
        this.id = id;
        this.ficha = ficha;
        this.letra = letra;
        this.nome = nome;
        this.ordem = ordem != null ? ordem : 1;
    }

    public void adicionarItem(ItemDivisao item) {
        itens.add(item);
        item.setDivisao(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FichaTreino getFicha() { return ficha; }
    public void setFicha(FichaTreino ficha) { this.ficha = ficha; }

    public String getLetra() { return letra; }
    public void setLetra(String letra) { this.letra = letra; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }

    public List<ItemDivisao> getItens() { return itens; }
    public void setItens(List<ItemDivisao> itens) { this.itens = itens; }
}
