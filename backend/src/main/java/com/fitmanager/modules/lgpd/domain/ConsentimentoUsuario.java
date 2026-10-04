package com.fitmanager.modules.lgpd.domain;

import com.fitmanager.modules.auth.domain.Usuario;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_consentimento_usuario", uniqueConstraints = {
    @UniqueConstraint(name = "uk_usuario_termo", columnNames = {"usuario_id", "termo_id"})
})
public class ConsentimentoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "termo_id", nullable = false)
    private TermoConsentimento termo;

    @Column(nullable = false)
    private boolean aceito = true;

    @CreationTimestamp
    @Column(name = "data_aceite", nullable = false, updatable = false)
    private OffsetDateTime dataAceite;

    @Column(name = "ip_origem", length = 45)
    private String ipOrigem;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    public ConsentimentoUsuario() {}

    public ConsentimentoUsuario(Long id, Usuario usuario, TermoConsentimento termo, boolean aceito, String ipOrigem, String userAgent) {
        this.id = id;
        this.usuario = usuario;
        this.termo = termo;
        this.aceito = aceito;
        this.ipOrigem = ipOrigem;
        this.userAgent = userAgent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public TermoConsentimento getTermo() { return termo; }
    public void setTermo(TermoConsentimento termo) { this.termo = termo; }

    public boolean isAceito() { return aceito; }
    public void setAceito(boolean aceito) { this.aceito = aceito; }

    public OffsetDateTime getDataAceite() { return dataAceite; }
    public void setDataAceite(OffsetDateTime dataAceite) { this.dataAceite = dataAceite; }

    public String getIpOrigem() { return ipOrigem; }
    public void setIpOrigem(String ipOrigem) { this.ipOrigem = ipOrigem; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}
