package com.fitmanager.modules.lgpd.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_termo_consentimento")
public class TermoConsentimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String versao;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(nullable = false)
    private boolean obrigatorio = true;

    @CreationTimestamp
    @Column(name = "data_publicacao", nullable = false, updatable = false)
    private OffsetDateTime dataPublicacao;

    @Column(nullable = false)
    private boolean ativo = true;

    public TermoConsentimento() {}

    public TermoConsentimento(Long id, String versao, String titulo, String conteudo, boolean obrigatorio, boolean ativo) {
        this.id = id;
        this.versao = versao;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.obrigatorio = obrigatorio;
        this.ativo = ativo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVersao() { return versao; }
    public void setVersao(String versao) { this.versao = versao; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }

    public boolean isObrigatorio() { return obrigatorio; }
    public void setObrigatorio(boolean obrigatorio) { this.obrigatorio = obrigatorio; }

    public OffsetDateTime getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(OffsetDateTime dataPublicacao) { this.dataPublicacao = dataPublicacao; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
}
