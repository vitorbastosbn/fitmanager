package com.fitmanager.modules.aluno;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.aluno.domain.Endereco;
import com.fitmanager.modules.aluno.dto.AlunoCreateDTO;
import com.fitmanager.modules.aluno.repository.AlunoRepository;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AlunoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        alunoRepository.deleteAll();
        usuarioRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "RECEPCIONISTA")
    @DisplayName("TASK-ALU-001/005/ADR-008: Cadastrar aluno cria usuário com senha dos 6 primeiros dígitos do CPF")
    void deveCadastrarAlunoComSucessoECriarUsuarioVinculado() throws Exception {
        // CPF válido com algoritmo dos dígitos verificadores: 52998224725
        AlunoCreateDTO dto = new AlunoCreateDTO(
                "Mariana Oliveira",
                "52998224725",
                LocalDate.of(1998, 5, 14),
                "11987654321",
                "mariana@email.com",
                new Endereco("Av. Paulista", "1000", "Bela Vista", "São Paulo", "SP", "01310100")
        );

        mockMvc.perform(post("/api/v1/alunos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.cpf", is("52998224725")))
                .andExpect(jsonPath("$.status", is("ATIVO")));

        // Verifica se o usuário vinculado foi criado no banco
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail("mariana@email.com");
        assertThat(usuarioOpt).isPresent();
        Usuario usuario = usuarioOpt.get();
        assertThat(usuario.getPerfil()).isEqualTo(TipoPerfil.ROLE_ALUNO);
        assertThat(usuario.getPrimeiroAcesso()).isTrue();
        // Senha inicial: 6 primeiros dígitos do CPF (529982)
        assertThat(passwordEncoder.matches("529982", usuario.getSenhaHash())).isTrue();
    }

    @Test
    @WithMockUser(roles = "RECEPCIONISTA")
    @DisplayName("TASK-ALU-003: Deve rejeitar cadastro com CPF inválido nos dígitos verificadores")
    void deveRejeitarCpfInvalido() throws Exception {
        AlunoCreateDTO dto = new AlunoCreateDTO(
                "Mariana Oliveira",
                "12345678900", // CPF com dígito inválido
                LocalDate.of(1998, 5, 14),
                "11987654321",
                "mariana@email.com",
                null
        );

        mockMvc.perform(post("/api/v1/alunos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title", is("Erro de validação")));
    }
}
