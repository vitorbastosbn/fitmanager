package com.fitmanager.modules.treino.domain;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.auth.domain.Usuario;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_ficha_treino")
public class FichaTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "instrutor_id", nullable = false)
    private Usuario instrutor;

    @Column(nullable = false, length = 100)
    private String objetivo;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_validade")
    private LocalDate dataValidade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusFicha status = StatusFicha.ATIVA;

    @OneToMany(mappedBy = "ficha", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<DivisaoTreino> divisoes = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    public FichaTreino() {}

    public FichaTreino(Long id, Aluno aluno, Usuario instrutor, String objetivo, LocalDate dataInicio, LocalDate dataValidade, StatusFicha status) {
        this.id = id;
        this.aluno = aluno;
        this.instrutor = instrutor;
        this.objetivo = objetivo;
        this.dataInicio = dataInicio;
        this.dataValidade = dataValidade;
        this.status = status != null ? status : StatusFicha.ATIVA;
    }

    public void adicionarDivisao(DivisaoTreino divisao) {
        divisoes.add(divisao);
        divisao.setFicha(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public Usuario getInstrutor() { return instrutor; }
    public void setInstrutor(Usuario instrutor) { this.instrutor = instrutor; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }

    public StatusFicha getStatus() { return status; }
    public void setStatus(StatusFicha status) { this.status = status; }

    public List<DivisaoTreino> getDivisoes() { return divisoes; }
    public void setDivisoes(List<DivisaoTreino> divisoes) { this.divisoes = divisoes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
