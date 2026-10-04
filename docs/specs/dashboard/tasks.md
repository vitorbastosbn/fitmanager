# Tarefas de Implementação: Dashboard Analítico (Dashboard)

## Fase 1: Backend e Serviços de Agregação
- [x] Criar DTOs de resposta: `DashboardAdminDTO`, `DashboardRecepcaoDTO`, `DashboardInstrutorDTO`, `DashboardAlunoDTO`.
- [x] Adicionar métodos de contagem e projeção agregada em `AlunoRepository`, `MatriculaRepository`, `CobrancaRepository`, `CheckInRepository` e `FichaTreinoRepository`.
- [x] Implementar `DashboardService.java` com métodos dedicados para cada perfil:
  - `obterDashboardAdmin()`
  - `obterDashboardRecepcao()`
  - `obterDashboardInstrutor(String instrutorEmail)`
  - `obterDashboardAluno(String alunoEmail)`
- [x] Criar `DashboardController.java` com mapeamento em `/api/v1/dashboard/*` protegido por `@PreAuthorize`.

## Fase 2: Frontend Angular
- [x] Criar modelos em `dashboard.models.ts`.
- [x] Implementar `DashboardService` em `dashboard.service.ts` com Signals.
- [x] Criar componente `DashboardComponent` com cards segmentados por perfil:
  - Administrador com fluxo horário e faturamento.
  - Recepção com bloqueios e últimos acessos.
  - Instrutor com alunos sem treino e atalho de prescrição.
  - Aluno com frequência semanal, streak e atalho para treino e catraca.
- [x] Configurar rota `/dashboard` para renderizar `DashboardComponent`.
- [x] Atualizar logo da barra superior para apontar para `/dashboard`.

## Fase 3: Testes e Validação
- [x] Criar testes unitários e de integração `DashboardControllerTest.java`.
- [ ] Integrar testes E2E do Dashboard na suíte do Playwright.
