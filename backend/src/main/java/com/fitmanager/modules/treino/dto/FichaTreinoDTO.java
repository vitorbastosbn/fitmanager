package com.fitmanager.modules.treino.dto;

import com.fitmanager.modules.treino.domain.FichaTreino;
import com.fitmanager.modules.treino.domain.StatusFicha;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class FichaTreinoDTO {
    private Long id;
    private Long alunoId;
    private String alunoNome;
    private Long instrutorId;
    private String instrutorNome;
    private String objetivo;
    private LocalDate dataInicio;
    private LocalDate dataValidade;
    private StatusFicha status;
    private List<DivisaoTreinoDTO> divisoes = new ArrayList<>();

    public FichaTreinoDTO() {}

    public static FichaTreinoDTO fromEntity(FichaTreino f) {
        FichaTreinoDTO dto = new FichaTreinoDTO();
        dto.setId(f.getId());
        dto.setAlunoId(f.getAluno().getId());
        dto.setAlunoNome(f.getAluno().getNome());
        dto.setInstrutorId(f.getInstrutor().getId());
        dto.setInstrutorNome(f.getInstrutor().getNome());
        dto.setObjetivo(f.getObjetivo());
        dto.setDataInicio(f.getDataInicio());
        dto.setDataValidade(f.getDataValidade());
        dto.setStatus(f.getStatus());
        if (f.getDivisoes() != null) {
            dto.setDivisoes(f.getDivisoes().stream().map(DivisaoTreinoDTO::fromEntity).toList());
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public String getAlunoNome() { return alunoNome; }
    public void setAlunoNome(String alunoNome) { this.alunoNome = alunoNome; }

    public Long getInstrutorId() { return instrutorId; }
    public void setInstrutorId(Long instrutorId) { this.instrutorId = instrutorId; }

    public String getInstrutorNome() { return instrutorNome; }
    public void setInstrutorNome(String instrutorNome) { this.instrutorNome = instrutorNome; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataValidade() { return dataValidade; }
    public void setDataValidade(LocalDate dataValidade) { this.dataValidade = dataValidade; }

    public StatusFicha getStatus() { return status; }
    public void setStatus(StatusFicha status) { this.status = status; }

    public List<DivisaoTreinoDTO> getDivisoes() { return divisoes; }
    public void setDivisoes(List<DivisaoTreinoDTO> divisoes) { this.divisoes = divisoes; }
}
