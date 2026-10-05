package com.fitmanager.modules.plano;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.PeriodicidadePlano;
import com.fitmanager.modules.plano.domain.Plano;
import com.fitmanager.modules.plano.dto.MatriculaCreateDTO;
import com.fitmanager.modules.plano.repository.MatriculaRepository;
import com.fitmanager.modules.plano.repository.PlanoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MatriculaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private CobrancaRepository cobrancaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Aluno alunoTeste;
    private Plano planoTrimestral;

    @BeforeEach
    void setUp() {
        cobrancaRepository.deleteAll();
        matriculaRepository.deleteAll();
        alunoRepository.deleteAll();
        planoRepository.deleteAll();

        alunoTeste = new Aluno(
                null,
                null,
                "Lucas Aluno",
                "01234567890",
                LocalDate.of(1995, 3, 20),
                "11999998888",
                "lucas@teste.com",
                StatusAluno.ATIVO,
                null
        );
        alunoTeste = alunoRepository.save(alunoTeste);

        planoTrimestral = new Plano(
                null,
                "Plano Trimestral Fit",
                "Acesso 3 meses",
                new BigDecimal("109.90"),
                PeriodicidadePlano.TRIMESTRAL,
                true
        );
        planoTrimestral = planoRepository.save(planoTrimestral);
    }

    @Test
    @WithMockUser(roles = "RECEPCIONISTA")
    @DisplayName("TASK-PLA-005/ADR-004/009: Matricular aluno gera vigência de 3 meses e 3 parcelas financeiras")
    void deveMatricularAlunoComSucessoEGearCobrancas() throws Exception {
        MatriculaCreateDTO dto = new MatriculaCreateDTO(
                alunoTeste.getId(),
                planoTrimestral.getId(),
                LocalDate.of(2026, 10, 4)
        );

        mockMvc.perform(post("/api/v1/matriculas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.dataInicio", is("2026-10-04")))
                .andExpect(jsonPath("$.dataTermino", is("2027-01-04"))) // 3 meses depois
                .andExpect(jsonPath("$.status", is("ATIVA")));

        // Verifica que foram geradas 3 cobranças mensais para o plano trimestral (TASK-FIN-004)
        List<Cobranca> cobrancas = cobrancaRepository.findByAlunoId(alunoTeste.getId());
        assertThat(cobrancas).hasSize(3);
        assertThat(cobrancas.get(0).getDataVencimento()).isEqualTo(LocalDate.of(2026, 10, 4));
        assertThat(cobrancas.get(1).getDataVencimento()).isEqualTo(LocalDate.of(2026, 11, 4));
        assertThat(cobrancas.get(2).getDataVencimento()).isEqualTo(LocalDate.of(2026, 12, 4));
    }

    @Test
    @WithMockUser(roles = "RECEPCIONISTA")
    @DisplayName("ADR-004: Deve impedir segunda matrícula ativa simultânea para o mesmo aluno")
    void deveBloquearSegundaMatriculaAtiva() throws Exception {
        MatriculaCreateDTO dto = new MatriculaCreateDTO(
                alunoTeste.getId(),
                planoTrimestral.getId(),
                LocalDate.of(2026, 10, 4)
        );

        // Primeira matrícula: Sucesso
        mockMvc.perform(post("/api/v1/matriculas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        // Segunda tentativa com matrícula ainda ativa: Bloqueio com HTTP 422
        mockMvc.perform(post("/api/v1/matriculas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.title", is("Regra de negócio violada")));
    }
}
