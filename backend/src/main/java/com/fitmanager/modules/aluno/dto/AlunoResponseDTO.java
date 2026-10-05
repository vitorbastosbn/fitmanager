package com.fitmanager.modules.aluno.dto;

import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.Endereco;
import com.fitmanager.modules.aluno.domain.StatusAluno;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class AlunoResponseDTO {
    private Long id;
    private Long usuarioId;
    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private String telefone;
    private String email;
    private StatusAluno status;
    private Endereco endereco;
    private OffsetDateTime createdAt;

    public AlunoResponseDTO() {}

    public AlunoResponseDTO(Long id, Long usuarioId, String nome, String cpf, LocalDate dataNascimento, String telefone, String email, StatusAluno status, Endereco endereco, OffsetDateTime createdAt) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.email = email;
        this.status = status;
        this.endereco = endereco;
        this.createdAt = createdAt;
    }

    public static AlunoResponseDTO fromEntity(Aluno aluno) {
        return new AlunoResponseDTO(
                aluno.getId(),
                aluno.getUsuarioId(),
                aluno.getNome(),
                aluno.getCpf(),
                aluno.getDataNascimento(),
                aluno.getTelefone(),
                aluno.getEmail(),
                aluno.getStatus(),
                aluno.getEndereco(),
                aluno.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public StatusAluno getStatus() { return status; }
    public void setStatus(StatusAluno status) { this.status = status; }

    public Endereco getEndereco() { return endereco; }
    public void setEndereco(Endereco endereco) { this.endereco = endereco; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
