package com.fitmanager.modules.treino;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.aluno.domain.Aluno;
import com.fitmanager.modules.aluno.domain.StatusAluno;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.treino.domain.Exercicio;
import com.fitmanager.modules.treino.domain.GrupoMuscular;
import com.fitmanager.modules.treino.domain.StatusFicha;
import com.fitmanager.modules.treino.dto.CriarDivisaoDTO;
import com.fitmanager.modules.treino.dto.CriarFichaTreinoDTO;
import com.fitmanager.modules.treino.dto.CriarItemDivisaoDTO;
import com.fitmanager.modules.treino.dto.RegistrarExecucaoDTO;
import com.fitmanager.modules.treino.repository.ExercicioRepository;
import com.fitmanager.modules.treino.repository.FichaTreinoRepository;
import com.fitmanager.modules.treino.repository.RegistroExecucaoTreinoRepository;
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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TreinoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ExercicioRepository exercicioRepository;

    @Autowired
    private FichaTreinoRepository fichaTreinoRepository;

    @Autowired
    private RegistroExecucaoTreinoRepository registroRepository;

    @Autowired
    private com.fitmanager.modules.frequencia.repository.CheckInRepository checkInRepository;

    @Autowired
    private com.fitmanager.modules.financeiro.repository.PagamentoRepository pagamentoRepository;

    @Autowired
    private com.fitmanager.modules.financeiro.repository.CobrancaRepository cobrancaRepository;

    @Autowired
    private com.fitmanager.modules.plano.repository.MatriculaRepository matriculaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Aluno alunoSalvo;
    private Usuario instrutorSalvo;
    private Exercicio exercicioSalvo;

    @BeforeEach
    void setUp() {
        checkInRepository.deleteAll();
        pagamentoRepository.deleteAll();
        cobrancaRepository.deleteAll();
        matriculaRepository.deleteAll();
        registroRepository.deleteAll();
        fichaTreinoRepository.deleteAll();
        exercicioRepository.deleteAll();
        alunoRepository.deleteAll();
        usuarioRepository.findByEmail("aluno.treino@fitmanager.com").ifPresent(usuarioRepository::delete);
        usuarioRepository.findByEmail("instrutor@fitmanager.com").ifPresent(usuarioRepository::delete);

        Usuario alunoUser = new Usuario(
                null,
                "Aluno Treino",
                "aluno.treino@fitmanager.com",
                "hashpwd",
                TipoPerfil.ROLE_ALUNO,
                true,
                false
        );
        alunoUser = usuarioRepository.save(alunoUser);

        alunoSalvo = new Aluno(
                null,
                alunoUser.getId(),
                "Aluno Treino Teste",
                "12345678901",
                LocalDate.of(1998, 5, 20),
                "11977776666",
                "aluno.treino@fitmanager.com",
                StatusAluno.ATIVO,
                null
        );
        alunoSalvo = alunoRepository.save(alunoSalvo);

        instrutorSalvo = new Usuario(
                null,
                "Instrutor Carlos",
                "instrutor@fitmanager.com",
                "hashpwd",
                TipoPerfil.ROLE_INSTRUTOR,
                true,
                false
        );
        instrutorSalvo = usuarioRepository.save(instrutorSalvo);

        exercicioSalvo = new Exercicio(
                null,
                "Supino Reto com Barra",
                GrupoMuscular.PEITO,
                "Deitar no banco horizontal...",
                true
        );
        exercicioSalvo = exercicioRepository.save(exercicioSalvo);
    }

    @Test
    @DisplayName("Deve listar exercícios do catálogo")
    @WithMockUser(username = "aluno.treino@fitmanager.com")
    void testListarExercicios() throws Exception {
        mockMvc.perform(get("/api/v1/exercicios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].nome", is("Supino Reto com Barra")));
    }

    @Test
    @DisplayName("Instrutor deve prescrever ficha de treino com divisões e exercícios com sucesso")
    @WithMockUser(username = "instrutor@fitmanager.com", roles = "INSTRUTOR")
    void testPrescreverFichaTreino() throws Exception {
        CriarItemDivisaoDTO item = new CriarItemDivisaoDTO();
        item.setExercicioId(exercicioSalvo.getId());
        item.setOrdemExecucao(1);
        item.setSeries(4);
        item.setRepeticoes("10-12");
        item.setCargaKg(new BigDecimal("30.00"));
        item.setDescansoSegundos(60);
        item.setObservacoes("Aquecimento leve na 1ª série");

        CriarDivisaoDTO divisaoA = new CriarDivisaoDTO();
        divisaoA.setLetra("A");
        divisaoA.setNome("Peito e Tríceps");
        divisaoA.setOrdem(1);
        divisaoA.setItens(List.of(item));

        CriarFichaTreinoDTO fichaDTO = new CriarFichaTreinoDTO();
        fichaDTO.setAlunoId(alunoSalvo.getId());
        fichaDTO.setObjetivo("Hipertrofia");
        fichaDTO.setDataInicio(LocalDate.now());
        fichaDTO.setDataValidade(LocalDate.now().plusMonths(3));
        fichaDTO.setDivisoes(List.of(divisaoA));

        mockMvc.perform(post("/api/v1/fichas-treino")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fichaDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.objetivo", is("Hipertrofia")))
                .andExpect(jsonPath("$.status", is("ATIVA")))
                .andExpect(jsonPath("$.divisoes", hasSize(1)))
                .andExpect(jsonPath("$.divisoes[0].letra", is("A")))
                .andExpect(jsonPath("$.divisoes[0].itens", hasSize(1)))
                .andExpect(jsonPath("$.divisoes[0].itens[0].exercicioNome", is("Supino Reto com Barra")));
    }

    @Test
    @DisplayName("Nova ficha prescrita deve arquivar automaticamente a ficha anterior do mesmo aluno")
    @WithMockUser(username = "instrutor@fitmanager.com", roles = "INSTRUTOR")
    void testArquivarFichaAnterior() throws Exception {
        CriarItemDivisaoDTO item = new CriarItemDivisaoDTO();
        item.setExercicioId(exercicioSalvo.getId());
        item.setSeries(3);
        item.setRepeticoes("12");
        item.setCargaKg(new BigDecimal("20.00"));
        item.setDescansoSegundos(45);

        CriarDivisaoDTO div = new CriarDivisaoDTO();
        div.setLetra("A");
        div.setNome("Adaptação");
        div.setItens(List.of(item));

        CriarFichaTreinoDTO ficha1 = new CriarFichaTreinoDTO();
        ficha1.setAlunoId(alunoSalvo.getId());
        ficha1.setObjetivo("Fase 1");
        ficha1.setDataInicio(LocalDate.now().minusMonths(1));
        ficha1.setDivisoes(List.of(div));

        // Prescreve primeira ficha
        mockMvc.perform(post("/api/v1/fichas-treino")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ficha1)))
                .andExpect(status().isCreated());

        // Prescreve segunda ficha
        CriarFichaTreinoDTO ficha2 = new CriarFichaTreinoDTO();
        ficha2.setAlunoId(alunoSalvo.getId());
        ficha2.setObjetivo("Fase 2");
        ficha2.setDataInicio(LocalDate.now());
        ficha2.setDivisoes(List.of(div));

        mockMvc.perform(post("/api/v1/fichas-treino")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ficha2)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.objetivo", is("Fase 2")))
                .andExpect(jsonPath("$.status", is("ATIVA")));

        // Verifica no banco se agora só existe 1 ATIVA e 1 HISTORICO
        org.junit.jupiter.api.Assertions.assertEquals(1, fichaTreinoRepository.findByAlunoIdAndStatus(alunoSalvo.getId(), StatusFicha.ATIVA).size());
        org.junit.jupiter.api.Assertions.assertEquals(1, fichaTreinoRepository.findByAlunoIdAndStatus(alunoSalvo.getId(), StatusFicha.HISTORICO).size());
    }
}
