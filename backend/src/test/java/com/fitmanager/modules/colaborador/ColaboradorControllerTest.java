package com.fitmanager.modules.colaborador;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.colaborador.domain.CargoPerfil;
import com.fitmanager.modules.colaborador.domain.TurnoTrabalho;
import com.fitmanager.modules.colaborador.dto.CriarColaboradorDTO;
import com.fitmanager.modules.colaborador.repository.ColaboradorRepository;
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

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ColaboradorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ColaboradorRepository colaboradorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        colaboradorRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Deve cadastrar colaborador instrutor com CREF com sucesso")
    void deveCadastrarInstrutorComSucesso() throws Exception {
        CriarColaboradorDTO dto = new CriarColaboradorDTO(
                "Carlos Silva Treinador",
                "98765432100",
                "carlos.treinador@fitmanager.com",
                "11977665544",
                CargoPerfil.ROLE_INSTRUTOR,
                "123456-G/SP",
                TurnoTrabalho.MANHA,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/v1/colaboradores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome", is("Carlos Silva Treinador")))
                .andExpect(jsonPath("$.cargoPerfil", is("ROLE_INSTRUTOR")))
                .andExpect(jsonPath("$.cref", is("123456-G/SP")))
                .andExpect(jsonPath("$.ativo", is(true)));

        assertThat(colaboradorRepository.existsByCpf("98765432100")).isTrue();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Deve rejeitar cadastro de instrutor sem CREF")
    void deveRejeitarInstrutorSemCref() throws Exception {
        CriarColaboradorDTO dto = new CriarColaboradorDTO(
                "Instrutor Sem Cref",
                "11122233344",
                "sem.cref@fitmanager.com",
                "11999990000",
                CargoPerfil.ROLE_INSTRUTOR,
                null,
                TurnoTrabalho.TARDE,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/v1/colaboradores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.detail", is("O número de registro no CREF é obrigatório para instrutores.")));
    }

    @Test
    @WithMockUser(roles = "ALUNO")
    @DisplayName("Deve barrar usuário com perfil ALUNO de cadastrar colaborador")
    void deveBarrarAlunoDeCadastrarColaborador() throws Exception {
        CriarColaboradorDTO dto = new CriarColaboradorDTO(
                "Tentativa Não Autorizada",
                "55566677788",
                "tentativa@fitmanager.com",
                "11988887777",
                CargoPerfil.ROLE_RECEPCIONISTA,
                null,
                TurnoTrabalho.INTEGRAL,
                LocalDate.now()
        );

        mockMvc.perform(post("/api/v1/colaboradores")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "RECEPCIONISTA")
    @DisplayName("Deve permitir listar instrutores ativos para recepcionista")
    void deveListarInstrutoresAtivos() throws Exception {
        mockMvc.perform(get("/api/v1/colaboradores/instrutores"))
                .andExpect(status().isOk());
    }
}
