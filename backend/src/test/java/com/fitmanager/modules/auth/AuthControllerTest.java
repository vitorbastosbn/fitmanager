package com.fitmanager.modules.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.dto.AlterarSenhaPrimeiroAcessoDTO;
import com.fitmanager.modules.auth.dto.LoginRequestDTO;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        usuarioRepository.deleteAll();

        Usuario admin = new Usuario(
                null,
                "Administrador Teste",
                "admin@teste.com",
                passwordEncoder.encode("SenhaForte@2026"),
                TipoPerfil.ROLE_ADMIN,
                true,
                false
        );
        usuarioRepository.save(admin);
    }

    @Test
    @DisplayName("TASK-AUTH-006: Deve autenticar com sucesso e retornar token JWT")
    void deveAutenticarComSucesso() throws Exception {
        LoginRequestDTO loginDTO = new LoginRequestDTO("admin@teste.com", "SenhaForte@2026");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.usuario.email", is("admin@teste.com")))
                .andExpect(jsonPath("$.usuario.perfil", is("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("TASK-AUTH-006: Deve rejeitar login com senha incorreta e retornar 401")
    void deveRejeitarSenhaIncorreta() throws Exception {
        LoginRequestDTO loginDTO = new LoginRequestDTO("admin@teste.com", "SenhaErrada");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.title", is("Falha na autenticação")));
    }

    @Test
    @DisplayName("TASK-AUTH-010: Deve permitir alterar senha no primeiro acesso")
    void deveAlterarSenhaPrimeiroAcesso() throws Exception {
        Usuario novoAluno = new Usuario(
                null,
                "Aluno Novo",
                "aluno@teste.com",
                passwordEncoder.encode("123456"),
                TipoPerfil.ROLE_ALUNO,
                true,
                true
        );
        usuarioRepository.save(novoAluno);

        LoginRequestDTO loginDTO = new LoginRequestDTO("aluno@teste.com", "123456");
        String responseContent = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(responseContent).get("accessToken").asText();

        AlterarSenhaPrimeiroAcessoDTO alteraDTO = new AlterarSenhaPrimeiroAcessoDTO("NovaSenhaForte@2026", "NovaSenhaForte@2026");

        mockMvc.perform(post("/api/v1/auth/alterar-senha-primeiro-acesso")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alteraDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem", notNullValue()));
    }

    @Test
    @DisplayName("TASK-AUTH-001: Senha padrão Admin@123 deve bater com hash da migration inicial")
    void testSenhaPadraoAdminBateComHash() {
        org.junit.jupiter.api.Assertions.assertTrue(
                passwordEncoder.matches("Admin@123", "$2a$10$G2dbjtoED0uEDcuRKoFk8uySuM1V6oWd7ImOCzJom7koPfO9ybWie")
        );
    }
}
