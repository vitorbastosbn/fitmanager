# Estado do Projeto (TLC State Tracking)

## Metadados do Projeto
- **Projeto**: FitManager - Sistema de Gestão de Academia
- **Versão Atual**: MVP 1.0 (Planejamento e Especificação)
- **Metodologia**: TLC Spec-Driven Development (v3)
- **Status Geral**: `MVP_IMPLEMENTADO_E_VERIFICADO`

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

---

## 2. Decisões Arquiteturais Registradas (ADRs)

- **ADR-001 - Stack Base**: Spring Boot 4.1.1, Java 21, Flyway, PostgreSQL.
- **ADR-002 - Frontend Framework**: Angular 21 com Standalone Components e Tailwind CSS.
- **ADR-003 - Estratégia de Segurança**: Stateless JWT com autenticação Bearer e perfis (`ADMIN`, `RECEPCIONISTA`, `INSTRUTOR`, `ALUNO`).
- **ADR-004 - Regra de Matrícula**: Apenas 1 matrícula ativa por aluno por período.
- **ADR-005 - Mecanismo de Check-in**: Leitura de QR Code temporário gerado no aplicativo do aluno e validado pelo terminal de recepção.
- **ADR-006 - Meios de Pagamento**: PIX, Cartão de Crédito e Cartão de Débito (sem dinheiro em espécie no MVP).
- **ADR-007 - Modelagem de Treino**: Divisões (A, B, C...) com exercícios vinculados a um catálogo central, contendo séries, repetições, carga (kg) e tempo de descanso.
- **ADR-008 - Senha Inicial do Aluno**: Senha temporária composta pelos 6 primeiros dígitos numéricos do CPF, com obrigatoriedade de redefinição no primeiro acesso (`primeiro_acesso = true`).
- **ADR-009 - Valor de Planos**: O campo `valor_mensalidade` em planos representa a mensalidade recorrente (planos trimestrais e anuais geram faturas mensais no valor da mensalidade).
- **ADR-010 - Tolerância de Inadimplência no Check-in**: Bloqueio de acesso por QR Code liberado até 5 dias corridos de atraso após o vencimento; bloqueio automático para atrasos superiores a 5 dias.
- **ADR-011 - Registro de Execução e Carga pelo Aluno**: Inclusão no MVP de registro da carga real (kg) e repetições executadas pelo aluno para acompanhamento de progressão de treinos.

---

## 3. Próximos Passos
1. Conclusão da escrita dos pacotes de especificação em `docs/specs/`.
2. Aprovação formal das especificações pelo humano.
3. Início do ciclo de execução (Setup de infraestrutura e migrações Flyway).
