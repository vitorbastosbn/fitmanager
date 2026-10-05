package com.fitmanager.modules.colaborador.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "tb_colaborador")
public class Colaborador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", unique = true, nullable = false)
    private Long usuarioId;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 20)
    private String telefone;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo_perfil", nullable = false, length = 50)
    private CargoPerfil cargoPerfil;

    @Column(length = 30)
    private String cref;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TurnoTrabalho turno = TurnoTrabalho.INTEGRAL;

    @Column(name = "data_admissao", nullable = false)
    private LocalDate dataAdmissao = LocalDate.now();

    @Column(nullable = false)
    private boolean ativo = true;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private OffsetDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private OffsetDateTime atualizadoEm;

    public Colaborador() {}

    public Colaborador(Long id, Long usuarioId, String nome, String cpf, String email, String telefone,
                       CargoPerfil cargoPerfil, String cref, TurnoTrabalho turno, LocalDate dataAdmissao, boolean ativo) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.telefone = telefone;
        this.cargoPerfil = cargoPerfil;
        this.cref = cref;
        this.turno = turno != null ? turno : TurnoTrabalho.INTEGRAL;
        this.dataAdmissao = dataAdmissao != null ? dataAdmissao : LocalDate.now();
        this.ativo = ativo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public CargoPerfil getCargoPerfil() { return cargoPerfil; }
    public void setCargoPerfil(CargoPerfil cargoPerfil) { this.cargoPerfil = cargoPerfil; }

    public String getCref() { return cref; }
    public void setCref(String cref) { this.cref = cref; }

    public TurnoTrabalho getTurno() { return turno; }
    public void setTurno(TurnoTrabalho turno) { this.turno = turno; }

    public LocalDate getDataAdmissao() { return dataAdmissao; }
    public void setDataAdmissao(LocalDate dataAdmissao) { this.dataAdmissao = dataAdmissao; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    public OffsetDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(OffsetDateTime criadoEm) { this.criadoEm = criadoEm; }

    public OffsetDateTime getAtualizadoEm() { return atualizadoEm; }
    public void setAtualizadoEm(OffsetDateTime atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
