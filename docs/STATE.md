# Estado do Projeto (TLC State Tracking)

## Metadados do Projeto
- **Projeto**: FitManager - Sistema de Gestão de Academia
- **Versão Atual**: MVP 1.1 (Ampliações: Colaboradores, Dashboard, Mobile e LGPD)
- **Metodologia**: TLC Spec-Driven Development (v3)
- **Status Geral**: `AMPLIACAO_CONCLUIDA_E_HOMOLOGADA`

---

## 1. Matriz de Domínios e Status

| Domínio | Especificação (`spec.md`) | Design Técnico (`design.md`) | Tarefas (`tasks.md`) | Status de Execução |
| :--- | :---: | :---: | :---: | :---: |
| **`auth`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`alunos`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`planos`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`financeiro`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`frequencia`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`treinos`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`colaboradores`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`dashboard`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`mobile`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |
| **`lgpd`** | ✅ Pronto | ✅ Pronto | ✅ Pronto | `CONCLUIDO` |

---

## 2. Decisões Arquiteturais Registradas (ADRs)

- **ADR-001 - Stack Base**: Spring Boot 3.4.3, Java 21, Flyway, PostgreSQL.
- **ADR-002 - Frontend Framework**: Angular 22 com Standalone Components e Tailwind CSS.
- **ADR-003 - Estratégia de Segurança**: Stateless JWT com autenticação Bearer e perfis (`ADMIN`, `RECEPCIONISTA`, `INSTRUTOR`, `ALUNO`).
- **ADR-004 - Regra de Matrícula**: Apenas 1 matrícula ativa por aluno por período.
- **ADR-005 - Mecanismo de Check-in**: Leitura de QR Code temporário gerado no aplicativo do aluno e validado pelo terminal de recepção.
- **ADR-006 - Meios de Pagamento**: PIX, Cartão de Crédito e Cartão de Débito (sem dinheiro em espécie no MVP).
- **ADR-007 - Modelagem de Treino**: Divisões (A, B, C...) com exercícios vinculados a um catálogo central, contendo séries, repetições, carga (kg) e tempo de descanso.
- **ADR-008 - Senha Inicial do Aluno**: Senha temporária composta pelos 6 primeiros dígitos numéricos do CPF, com obrigatoriedade de redefinição no primeiro acesso (`primeiro_acesso = true`).
- **ADR-009 - Valor de Planos**: O campo `valor_mensalidade` em planos representa a mensalidade recorrente (planos trimestrais e anuais geram faturas mensais no valor da mensalidade).
- **ADR-010 - Tolerância de Inadimplência no Check-in**: Bloqueio de acesso por QR Code liberado até 5 dias corridos de atraso após o vencimento; bloqueio automático para atrasos superiores a 5 dias.
- **ADR-011 - Registro de Execução e Carga pelo Aluno**: Inclusão no MVP de registro da carga real (kg) e repetições executadas pelo aluno para acompanhamento de progressão de treinos.
- **ADR-012 - Gestão de Colaboradores e CREF**: Criação de colaboradores associados a usuários de sistema, com exigência mandatória de registro no Conselho Regional de Educação Física (CREF) apenas para instrutores e trava que impede desativação do último administrador ativo.
- **ADR-013 - Dashboards Segmentados por Perfil**: Endpoints e agregações SQL específicas para cada perfil operacional (Admin: receita/faturamento/ocupação; Recepção: bloqueios e vencimentos de hoje; Instrutor: fichas pendentes; Aluno: frequência semanal e treinos).
- **ADR-014 - Bottom Navigation Bar Mobile**: Implementação de barra inferior fixa para visualizações mobile (< 768px) com atalhos contextuais baseados no perfil logado e hitboxes ergonômicas (thumb zone) >= 44px.
- **ADR-015 - Conformidade LGPD e Retenção Fiscal**: Registro de consentimento formal versionado, exportação estruturada de dados (JSON), anonimização irreversível ("direito ao esquecimento") preservando valores contábeis e fiscais por 5 anos (Art. 173 do CTN) desvinculados de dados pessoais identificáveis, mascaramento de CPF na interface e trilha de auditoria administrativa imutável.

---

## 3. Status de Homologação e Entrega
- **Testes Unitários e Integração (Backend):** 30/30 testes aprovados com 100% de sucesso (`mvnw test`).
- **Build de Produção (Frontend):** 100% aprovado sem erros de compilação (`npm run build`).
- **Validação E2E com Playwright:** 10/10 fluxos críticos validados com 100% de sucesso (`node frontend/e2e-playwright-test.mjs`):
  1. Login de Administrador e Shell de Navegação
  2. Dashboard Operacional Multi-Perfil (KPIs & Gráfico de Fluxo Horário)
  3. Gestão de Colaboradores (Exigência dinâmica de CREF para Instrutores)
  4. Central de Privacidade & Portabilidade de Dados LGPD (Art. 18, V)
  5. Trilha de Auditoria LGPD e Governança Administrativa
  6. Cadastro Completo de Aluno & Mascaramento de CPF (LGPD)
  7. Contratação de Plano e Matrícula com Vigência
  8. Quitação Financeira Idempotente (PIX)
  9. Compatibilidade Mobile no Viewport 375x667 (Thumb Zone Bottom Navigation)
  10. Logout e Limpeza de Sessão
- **Repositório GitHub & Pull Request:**
  - Branch ativa: `feat/mvp-implementation`
  - Pull Request #1: `feat/mvp-implementation` -> `main`
  - Repositório: `https://github.com/vitorbastosbn/fitmanager.git`
