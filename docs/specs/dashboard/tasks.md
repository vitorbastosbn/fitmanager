# Tarefas de Implementação: Dashboard Analítico (Dashboard)

## Fase 1: Backend e Serviços de Agregação
- [ ] Criar DTOs de resposta: `DashboardAdminDTO`, `DashboardRecepcaoDTO`, `DashboardInstrutorDTO`, `DashboardAlunoDTO`.
- [ ] Adicionar métodos de contagem e projeção agregada em `AlunoRepository`, `MatriculaRepository`, `CobrancaRepository`, `CheckInRepository` e `FichaTreinoRepository`.
- [ ] Implementar `DashboardService.java` com métodos dedicados para cada perfil:
  - `obterDashboardAdmin()`
  - `obterDashboardRecepcao()`
  - `obterDashboardInstrutor(String instrutorEmail)`
  - `obterDashboardAluno(String alunoEmail)`
- [ ] Criar `DashboardController.java` com mapeamento em `/api/v1/dashboard/*` protegido por `@PreAuthorize`.

## Fase 2: Frontend Angular
- [ ] Criar modelos em `dashboard.models.ts`.
- [ ] Implementar `DashboardService` em `dashboard.service.ts` com Signals.
- [ ] Criar componente reutilizável `KpiCardComponent`.
- [ ] Criar componente `DashboardAdminComponent` com métricas financeiras e fluxo da academia.
- [ ] Criar componente `DashboardRecepcaoComponent` com alertas de bloqueio de catraca e vencimentos.
- [ ] Criar componente `DashboardInstrutorComponent` com fichas pendentes e reavaliações.
- [ ] Criar componente `DashboardAlunoComponent` com frequência semanal, streak e atalho para pagar próxima fatura.
- [ ] Configurar rota `/dashboard` para renderizar `DashboardContainerComponent`.
- [ ] Atualizar logo da barra superior para apontar para `/dashboard`.

## Fase 3: Testes e Validação
- [ ] Criar testes unitários e de integração `DashboardControllerTest.java`.
- [ ] Integrar testes E2E do Dashboard na suíte do Playwright.
