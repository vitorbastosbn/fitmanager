package com.fitmanager.modules.dashboard;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("Deve carregar dashboard do Admin com sucesso")
    void deveCarregarDashboardAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAlunosAtivos", notNullValue()))
                .andExpect(jsonPath("$.faturamentoMesAtual", notNullValue()))
                .andExpect(jsonPath("$.fluxoPorHorario", notNullValue()));
    }

    @Test
    @WithMockUser(roles = "RECEPCIONISTA")
    @DisplayName("Deve carregar dashboard da Recepção com sucesso")
    void deveCarregarDashboardRecepcao() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/recepcao"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkInsHoje", notNullValue()))
                .andExpect(jsonPath("$.bloqueiosHoje", notNullValue()));
    }

    @Test
    @WithMockUser(roles = "INSTRUTOR")
    @DisplayName("Deve carregar dashboard do Instrutor com sucesso")
    void deveCarregarDashboardInstrutor() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/instrutor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalAlunosAtivos", notNullValue()))
                .andExpect(jsonPath("$.totalFichasPrescritas", notNullValue()));
    }

    @Test
    @WithMockUser(roles = "ALUNO")
    @DisplayName("Deve proibir perfil Aluno de acessar dashboard de administração")
    void deveProibirAlunoAcessarDashboardAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/admin"))
                .andExpect(status().isForbidden());
    }
}
