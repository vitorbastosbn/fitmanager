package com.fitmanager.modules.frequencia.domain;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.auth.domain.Usuario;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_checkin")
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(name = "data_hora", nullable = false)
    private OffsetDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private StatusAcessoCheckin status;

    @Column(name = "motivo_bloqueio", length = 100)
    private String motivoBloqueio;

    @Column(name = "token_nonce", length = 64, unique = true)
    private String tokenNonce;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operador_id")
    private Usuario operador;

    public CheckIn() {}

    public CheckIn(Aluno aluno, OffsetDateTime dataHora, StatusAcessoCheckin status, String motivoBloqueio, String tokenNonce, Usuario operador) {
        this.aluno = aluno;
        this.dataHora = dataHora;
        this.status = status;
        this.motivoBloqueio = motivoBloqueio;
        this.tokenNonce = tokenNonce;
        this.operador = operador;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public OffsetDateTime getDataHora() { return dataHora; }
    public void setDataHora(OffsetDateTime dataHora) { this.dataHora = dataHora; }

    public StatusAcessoCheckin getStatus() { return status; }
    public void setStatus(StatusAcessoCheckin status) { this.status = status; }

    public String getMotivoBloqueio() { return motivoBloqueio; }
    public void setMotivoBloqueio(String motivoBloqueio) { this.motivoBloqueio = motivoBloqueio; }

    public String getTokenNonce() { return tokenNonce; }
    public void setTokenNonce(String tokenNonce) { this.tokenNonce = tokenNonce; }

    public Usuario getOperador() { return operador; }
    public void setOperador(Usuario operador) { this.operador = operador; }
}
