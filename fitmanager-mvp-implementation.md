# FitManager MVP - Plano de Implementação

## Objetivo
Implementar o sistema FitManager (MVP 1.0) conforme as especificações formais do TLC (`docs/specs/`), com arquitetura monorepo (Backend Spring Boot com Java 21, Frontend Angular Standalone com Tailwind CSS, e PostgreSQL 16 com Flyway).

---

## Decisões Validadas no Socratic Gate
1. **Abordagem**: Incremental vertical por domínio (Infra/Setup -> Auth -> Alunos & Planos -> Financeiro -> Frequência -> Treinos).
2. **Backend**: Spring Boot com Maven Wrapper (`mvnw`), Java 21 e PostgreSQL 16.
3. **Frontend**: Angular 21/Standalone Components, Signals e Tailwind CSS.
4. **Git**: Inicialização do repositório local e branch de trabalho dedicada `feat/mvp-implementation`.
5. **Edge Case Auth (ADR-008)**: Bloqueio estrito no SecurityFilterChain para `primeiro_acesso = true` até a alteração da senha.
6. **Edge Case Frequência (ADR-010)**: Validação transacional em tempo real de inadimplência no check-in para liberação imediata pós-quitação.

---

## Tarefas de Execução

- [x] **Task 1: Setup de Repositório e Infraestrutura**
  - Inicializar Git e criar branch `feat/mvp-implementation`.
  - Criar `docker-compose.yml` para PostgreSQL 16 (`fitmanager_db`).
  - Inicializar estrutura monorepo com `backend/` (Spring Boot 3.4/Java 21, Flyway, JPA, Security, Lombok, Validation, JJWT) e `frontend/` (Angular Standalone + Tailwind CSS).
  - *Verificação*: Containers sobem via Docker; backend compila com `./mvnw compile`; frontend compila com `npm run build`. (CONCLUÍDO)

- [x] **Task 2: Domínio Auth (Backend + DB + Frontend)**
  - Migration Flyway `V1__create_table_usuario.sql` (schema, enums, índices).
  - Entidade `Usuario`, `TipoPerfil`, `UsuarioRepository`.
  - Spring Security com Stateless JWT, BCrypt, filtro de autorização e trava para `primeiroAcesso`.
  - `AuthController` e `AuthenticationService` (`/login`, `/me`, `/alterar-senha-primeiro-acesso`).
  - Frontend: `AuthService` com Signals, guards (`AuthGuard`, `RoleGuard`), `LoginComponent` e `PrimeiroAcessoModalComponent`.
  - *Verificação*: Testes de login, emissão/validação de JWT e bloqueio de rotas no primeiro acesso. (CONCLUÍDO - 3 testes passando)

- [x] **Task 3: Domínio Alunos (Backend + DB + Frontend)**
  - Migration Flyway `V2__create_table_aluno.sql` com FK para `tb_usuario` e unique em `cpf`.
  - Entidade `Aluno`, `StatusAluno`, `AlunoRepository` com `JpaSpecificationExecutor`.
  - Validador customizado `@CPF`, `AlunoService` (criação de usuário automático com senha inicial dos 6 primeiros dígitos do CPF), `AlunoController`.
  - Frontend: `AlunoService`, `AlunoListComponent` com busca e paginação, `AlunoFormComponent`.
  - *Verificação*: Cadastro de aluno cria usuário com senha inicial esperada; tentativa de CPF duplicado/inválido retorna erro RFC 7807. (CONCLUÍDO - 2 testes passando)

- [x] **Task 4: Domínio Planos e Matrículas (Backend + DB + Frontend)**
  - Migration Flyway `V3__create_tables_plano_e_matricula.sql`.
  - Entidades `Plano`, `Matricula`, enums `PeriodicidadePlano` e `StatusMatricula`.
  - `PlanoService` (CRUD por `ADMIN`) e `MatriculaService` (regra de 1 matrícula ativa e cálculo de vigência).
  - `PlanoController` e `MatriculaController`.
  - Frontend: `PlanoCardsComponent` e `MatriculaFlowComponent`.
  - *Verificação*: Bloqueio de segunda matrícula ativa simultânea; vigência calculada por periodicidade (1, 3 e 12 meses). (CONCLUÍDO - 2 testes passando)

- [x] **Task 5: Domínio Financeiro (Backend + DB + Frontend)**
  - Migration Flyway `V4__create_tables_cobranca_e_pagamento.sql`.
  - Entidades `Cobranca`, `Pagamento`, enums `StatusCobranca` e `FormaPagamento` (PIX, CARTAO_CREDITO, CARTAO_DEBITO).
  - `CobrancaService` (geração de faturas na criação da matrícula) e `PagamentoService` (quitação com trava de idempotência contra pagamento duplo).
  - `FinanceiroController` (`/cobrancas`, `/pagar`, `/alunos/me/cobrancas`).
  - Frontend: `FinanceiroService`, `PagamentoModalComponent`, tabela de faturas no portal do aluno e painel da recepção.
  - *Verificação*: Matrícula gera cobranças correspondentes; quitação atualiza status e rejeita pagamento duplicado. (CONCLUÍDO - 2 testes passando)

- [x] **Task 6: Domínio Frequência e Check-in QR Code (Backend + DB + Frontend)**
  - Migration Flyway `V5__create_table_checkin.sql` com chave única no `token_nonce`.
  - Entidade `CheckIn`, enum `StatusAcessoCheckin`.
  - `QrTokenService` (HMAC SHA-256 efêmero de 60s) e `FrequenciaService` (regras de tolerância de até 5 dias de atraso e intervalo mínimo de 30 min).
  - `FrequenciaController` (`/qrcode-token`, `/check-in`, `/hoje`).
  - Frontend: `AlunoQrCodeComponent` (renderização SVG e timer de 60s) e `TerminalScannerComponent` (painel recepção com leitor/câmera).
  - *Verificação*: Token expirado (>60s) ou reutilizado é rejeitado; atraso >5 dias bloqueia acesso; quitação regulariza acesso imediatamente. (CONCLUÍDO - 4 testes passando)

- [x] **Task 7: Domínio Treinos e Exercícios (Backend + DB + Frontend)**
  - Migrations Flyway `V6__create_tables_treinos_e_exercicios.sql` e `V7__seed_catalogo_exercicios_iniciais.sql` (37 exercícios essenciais pré-populados).
  - Entidades `Exercicio`, `FichaTreino`, `DivisaoTreino`, `ItemDivisao`, `RegistroExecucaoTreino`.
  - `FichaTreinoService` (arquivamento da ficha anterior ao ativar nova) e controladores REST.
  - Frontend: `ExercicioCatalogoComponent`, `FichaPrescricaoFormComponent` (divisões A, B, C), `FichaVisualizacaoMobileComponent` e registro de evolução de carga.
  - *Verificação*: Seed de exercícios disponível; arquivamento automático de ficha prévia; aluno registra carga e repetições executadas. (CONCLUÍDO - 3 testes passando)

- [x] **Task 8: Verificação de Integração e Atualização de Estado**
  - Executar testes automatizados no backend (`./mvnw test` - 16 testes passando com 0 falhas).
  - Validar build e integridade no frontend (`npm run build` - bundle de produção gerado com sucesso).
  - Atualizar `docs/STATE.md` para refletir a conclusão das tarefas executadas. (CONCLUÍDO)

---

## Critérios de Sucesso ("Done When")
- [x] Backend Spring Boot rodando com todas as 7 migrations Flyway aplicadas no PostgreSQL.
- [x] Todos os endpoints REST dos 6 domínios funcionando conforme as especificações em `docs/specs/`.
- [x] Frontend Angular Standalone integrado consumindo as APIs com design responsivo em Tailwind CSS.
- [x] Suíte de testes automatizados e builds passando sem erros.
