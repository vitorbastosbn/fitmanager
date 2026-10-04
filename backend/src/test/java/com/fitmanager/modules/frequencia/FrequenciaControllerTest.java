package com.fitmanager.modules.frequencia;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.financeiro.domain.Cobranca;
import com.fitmanager.modules.financeiro.domain.StatusCobranca;
import com.fitmanager.modules.financeiro.repository.CobrancaRepository;
import com.fitmanager.modules.financeiro.repository.PagamentoRepository;
import com.fitmanager.modules.frequencia.dto.CheckInRequestDTO;
import com.fitmanager.modules.frequencia.repository.CheckInRepository;
import com.fitmanager.modules.frequencia.service.QrTokenService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FrequenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CheckInRepository checkInRepository;

    @Autowired
    private PagamentoRepository pagamentoRepository;

    @Autowired
    private CobrancaRepository cobrancaRepository;

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private PlanoRepository planoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private QrTokenService qrTokenService;

    private Aluno alunoSalvo;
    private Matricula matriculaSalva;

    @BeforeEach
    void setUp() {
        checkInRepository.deleteAll();
        pagamentoRepository.deleteAll();
        cobrancaRepository.deleteAll();
        matriculaRepository.deleteAll();
        alunoRepository.deleteAll();
        usuarioRepository.deleteAll();
        planoRepository.deleteAll();

        Usuario usuario = new Usuario(
                null,
                "Mariana Frequencia",
                "mariana.freq@fitmanager.com",
                "hashpwd",
                TipoPerfil.ROLE_ALUNO,
                true,
                false
        );
        usuario = usuarioRepository.save(usuario);

        Aluno aluno = new Aluno(
                null,
                usuario.getId(),
                "Mariana Silva Frequencia",
                "89248792000",
                LocalDate.of(1995, 8, 12),
                "11988887777",
                "mariana.freq@fitmanager.com",
                StatusAluno.ATIVO,
                null
        );
        alunoSalvo = alunoRepository.save(aluno);

        Plano plano = new Plano(
                null,
                "Plano Teste Freq",
                "Descricao",
                new BigDecimal("120.00"),
                PeriodicidadePlano.MENSAL,
                true
        );
        plano = planoRepository.save(plano);

        Matricula matricula = new Matricula(
                null,
                alunoSalvo,
                plano,
                LocalDate.now().minusDays(10),
                LocalDate.now().plusMonths(1),
                new BigDecimal("120.00"),
                StatusMatricula.ATIVA
        );
        matriculaSalva = matriculaRepository.save(matricula);
    }

    @Test
    @DisplayName("Aluno autenticado deve gerar token QR Code efêmero com sucesso")
    @WithMockUser(username = "mariana.freq@fitmanager.com", roles = "ALUNO")
    void testGerarTokenQrCode() throws Exception {
        mockMvc.perform(get("/api/v1/frequencia/qrcode-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.segundosValidade", is(60)))
                .andExpect(jsonPath("$.geradoEm", notNullValue()));
    }

    @Test
    @DisplayName("Recepção deve validar check-in e liberar acesso para aluno adimplente com matrícula ativa")
    @WithMockUser(username = "recepcao@fitmanager.com", roles = "RECEPCIONISTA")
    void testCheckInLiberado() throws Exception {
        String token = qrTokenService.gerarToken(alunoSalvo.getId());
        CheckInRequestDTO req = new CheckInRequestDTO(token);

        mockMvc.perform(post("/api/v1/frequencia/check-in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("LIBERADO")))
                .andExpect(jsonPath("$.alunoId", is(alunoSalvo.getId().intValue())))
                .andExpect(jsonPath("$.alunoNome", is(alunoSalvo.getNome())))
                .andExpect(jsonPath("$.planoNome", is(matriculaSalva.getPlano().getNome())))
                .andExpect(jsonPath("$.mensagem", is("Entrada autorizada. Bom treino!")));
    }

    @Test
    @DisplayName("Recepção deve bloquear check-in de aluno inadimplente após tolerância de 5 dias corridos")
    @WithMockUser(username = "recepcao@fitmanager.com", roles = "RECEPCIONISTA")
    void testCheckInBloqueadoPorInadimplencia() throws Exception {
        // Cobrança vencida há 10 dias (ultrapassa a tolerância de 5 dias)
        Cobranca cobrancaAtrasada = new Cobranca(
                null,
                matriculaSalva,
                new BigDecimal("120.00"),
                LocalDate.now().minusDays(10),
                StatusCobranca.PENDENTE
        );
        cobrancaRepository.save(cobrancaAtrasada);

        String token = qrTokenService.gerarToken(alunoSalvo.getId());
        CheckInRequestDTO req = new CheckInRequestDTO(token);

        mockMvc.perform(post("/api/v1/frequencia/check-in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status", is("BLOQUEADO")))
                .andExpect(jsonPath("$.motivo", is("INADIMPLENCIA_TOLERANCIA_EXCEDIDA")));
    }

    @Test
    @DisplayName("Recepção deve rejeitar token QR Code reutilizado (One-time use / Nonce)")
    @WithMockUser(username = "recepcao@fitmanager.com", roles = "RECEPCIONISTA")
    void testRejeitarTokenReutilizado() throws Exception {
        String token = qrTokenService.gerarToken(alunoSalvo.getId());
        CheckInRequestDTO req = new CheckInRequestDTO(token);

        // Primeiro uso: Liberado
        mockMvc.perform(post("/api/v1/frequencia/check-in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        // Segundo uso do mesmo token: Bloqueio 400 Bad Request
        mockMvc.perform(post("/api/v1/frequencia/check-in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}
