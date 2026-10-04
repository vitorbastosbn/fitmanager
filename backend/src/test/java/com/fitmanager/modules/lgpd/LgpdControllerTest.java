package com.fitmanager.modules.lgpd;

import com.fitmanager.modules.auth.domain.TipoPerfil;
import com.fitmanager.modules.auth.domain.Usuario;
import com.fitmanager.modules.auth.repository.UsuarioRepository;
import com.fitmanager.modules.lgpd.domain.TermoConsentimento;
import com.fitmanager.modules.lgpd.repository.ConsentimentoUsuarioRepository;
import com.fitmanager.modules.lgpd.repository.LogAuditoriaLgpdRepository;
import com.fitmanager.modules.lgpd.repository.TermoConsentimentoRepository;
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

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LgpdControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TermoConsentimentoRepository termoRepository;

    @Autowired
    private ConsentimentoUsuarioRepository consentimentoRepository;

    @Autowired
    private LogAuditoriaLgpdRepository logAuditoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private TermoConsentimento termoVigente;

    @BeforeEach
    void setUp() {
        consentimentoRepository.deleteAll();
        logAuditoriaRepository.deleteAll();

        if (!usuarioRepository.existsByEmail("usuario.lgpd@fitmanager.com")) {
            Usuario u = new Usuario(
                    null,
                    "Usuário Teste LGPD",
                    "usuario.lgpd@fitmanager.com",
                    passwordEncoder.encode("Senha@123"),
                    TipoPerfil.ROLE_ALUNO,
                    true,
                    false
            );
            usuarioRepository.save(u);
        }

        termoVigente = termoRepository.findFirstByAtivoTrueOrderByDataPublicacaoDesc()
                .orElseGet(() -> termoRepository.save(new TermoConsentimento(
                        null,
                        "1.0",
                        "Termos de Uso e Política de Privacidade",
                        "Texto do termo...",
                        true,
                        true
                )));
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() {
        consentimentoRepository.deleteAll();
        logAuditoriaRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "usuario.lgpd@fitmanager.com", roles = "ALUNO")
    @DisplayName("Deve consultar o termo vigente e indicar status de aceite")
    void deveObterTermoVigente() throws Exception {
        mockMvc.perform(get("/api/v1/lgpd/termos/vigente"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.versao", notNullValue()))
                .andExpect(jsonPath("$.titulo", notNullValue()))
                .andExpect(jsonPath("$.conteudo", notNullValue()));
    }

    @Test
    @WithMockUser(username = "usuario.lgpd@fitmanager.com", roles = "ALUNO")
    @DisplayName("Deve registrar aceite formal do termo de privacidade")
    void deveRegistrarAceiteDoTermo() throws Exception {
        mockMvc.perform(post("/api/v1/lgpd/termos/" + termoVigente.getId() + "/aceite"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem", is("Consentimento registrado com sucesso.")));
    }

    @Test
    @WithMockUser(username = "usuario.lgpd@fitmanager.com", roles = "ALUNO")
    @DisplayName("Deve exportar pacote de dados pessoais estruturado em JSON")
    void deveExportarDadosPessoais() throws Exception {
        mockMvc.perform(get("/api/v1/lgpd/meus-dados/exportar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.versaoExportacao", is("1.0")))
                .andExpect(jsonPath("$.titular", notNullValue()))
                .andExpect(jsonPath("$.consentimentos", notNullValue()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Deve permitir administrador consultar trilha de auditoria LGPD")
    void devePermitirAdminConsultarAuditoria() throws Exception {
        mockMvc.perform(get("/api/v1/lgpd/auditoria"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", notNullValue()));
    }

    @Test
    @WithMockUser(roles = "ALUNO")
    @DisplayName("Deve proibir aluno de consultar trilha geral de auditoria LGPD")
    void deveProibirAlunoConsultarAuditoria() throws Exception {
        mockMvc.perform(get("/api/v1/lgpd/auditoria"))
                .andExpect(status().isForbidden());
    }
}
