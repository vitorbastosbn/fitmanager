package com.fitmanager.modules.financeiro;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.FormaPagamento;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import com.fitmanager.modules.financeiro.dto.PagarCobrancaDTO;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.financeiro.repository.PagamentoRepository;
import com.fitmanager.modules.plano.domain.Matricula;
import com.fitmanager.modules.plano.domain.PeriodicidadePlano;
import com.fitmanager.modules.plano.domain.Plano;
import com.fitmanager.modules.plano.domain.StatusMatricula;
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

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FinanceiroControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CobrancaRepository cobrancaRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Cobranca cobrancaTeste;

    @BeforeEach
    void setUp() {
        pagamentoRepository.deleteAll();
        cobrancaRepository.deleteAll();
        matriculaRepository.deleteAll();
        alunoRepository.deleteAll();
        planoRepository.deleteAll();
        usuarioRepository.deleteAll();

        Usuario operador = new Usuario(
                null,
                "Atendente Recepcao",
                "recepcao@teste.com",
                "hash",
                TipoPerfil.ROLE_RECEPCIONISTA,
                true,
                false
        );
        usuarioRepository.save(operador);

        Aluno aluno = new Aluno(
                null,
                null,
                "Mariana Financeiro",
                "11122233344",
                LocalDate.of(2000, 1, 1),
                "11988887777",
                "mariana.fin@teste.com",
                StatusAluno.ATIVO,
                null
        );
        aluno = alunoRepository.save(aluno);

        Plano plano = new Plano(
                null,
                "Plano Mensal",
                "Descricao",
                new BigDecimal("120.00"),
                PeriodicidadePlano.MENSAL,
                true
        );
        plano = planoRepository.save(plano);

        Matricula matricula = new Matricula(
                null,
                aluno,
                plano,
                LocalDate.now(),
                LocalDate.now().plusMonths(1),
                new BigDecimal("120.00"),
                StatusMatricula.ATIVA
        );
        matricula = matriculaRepository.save(matricula);

        cobrancaTeste = new Cobranca(
                null,
                matricula,
                new BigDecimal("120.00"),
                LocalDate.now().plusDays(5),
                StatusCobranca.PENDENTE
        );
        cobrancaTeste = cobrancaRepository.save(cobrancaTeste);
    }

    @Test
    @WithMockUser(username = "recepcao@teste.com", roles = "RECEPCIONISTA")
    @DisplayName("TASK-FIN-005/006: Quitar cobrança com PIX deve atualizar status para PAGO")
    void deveQuitarCobrancaComSucesso() throws Exception {
        PagarCobrancaDTO dto = new PagarCobrancaDTO(
                FormaPagamento.PIX,
                new BigDecimal("120.00"),
                "E0000000020261003PIX123",
                "Pagamento efetuado na recepção"
        );

        mockMvc.perform(post("/api/v1/cobrancas/" + cobrancaTeste.getId() + "/pagar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.statusCobranca", is("PAGO")))
                .andExpect(jsonPath("$.formaPagamento", is("PIX")))
                .andExpect(jsonPath("$.pagamentoId", notNullValue()));
    }

    @Test
    @WithMockUser(username = "recepcao@teste.com", roles = "RECEPCIONISTA")
    @DisplayName("TASK-FIN-005: Deve bloquear tentativa de quitação duplicada da mesma cobrança")
    void deveBloquearQuitacaoDuplicada() throws Exception {
        PagarCobrancaDTO dto = new PagarCobrancaDTO(
                FormaPagamento.PIX,
                new BigDecimal("120.00"),
                "E0000000020261003PIX123",
                null
        );

        // Primeira quitação: Sucesso
        mockMvc.perform(post("/api/v1/cobrancas/" + cobrancaTeste.getId() + "/pagar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Segunda tentativa na mesma cobrança: Erro 422
        mockMvc.perform(post("/api/v1/cobrancas/" + cobrancaTeste.getId() + "/pagar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.title", is("Regra de negócio violada")));
    }
}
