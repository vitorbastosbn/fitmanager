package com.fitmanager.modules.lgpd.domain;

import com.fitmanager.modules.auth.domain.Usuario;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_log_auditoria_lgpd")
public class LogAuditoriaLgpd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operador_id", nullable = false)
    private Usuario operador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "titular_id")
    private Usuario titular;

    @Column(nullable = false, length = 60)
    private String acao;

    @Column(columnDefinition = "TEXT")
    private String detalhes;

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    public LogAuditoriaLgpd() {}

    public LogAuditoriaLgpd(Long id, Usuario operador, Usuario titular, String acao, String detalhes, String ipOrigem) {
        this.id = id;
        this.operador = operador;
        this.titular = titular;
        this.acao = acao;
        this.detalhes = detalhes;
        this.ipOrigem = ipOrigem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getOperador() { return operador; }
    public void setOperador(Usuario operador) { this.operador = operador; }

    public Usuario getTitular() { return titular; }
    public void setTitular(Usuario titular) { this.titular = titular; }

    public String getAcao() { return acao; }
    public void setAcao(String acao) { this.acao = acao; }

    public String getDetalhes() { return detalhes; }
    public void setDetalhes(String detalhes) { this.detalhes = detalhes; }

    public String getIpOrigem() { return ipOrigem; }
    public void setIpOrigem(String ipOrigem) { this.ipOrigem = ipOrigem; }

    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime criadoEm) { this.criadoEm = criadoEm; }
}
