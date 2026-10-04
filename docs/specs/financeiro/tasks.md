# Tarefas de Implementação: Financeiro Básico (Financeiro)

## Checklist de Tarefas Atômicas

- [ ] **TASK-FIN-001 (DB)**: Criar migration Flyway `V4__create_tables_cobranca_e_pagamento.sql` com enums, schemas e foreign keys.
  - *Critério de Aceite*: Tabelas `tb_cobranca` e `tb_pagamento` criadas; restrição de método de pagamento respeitando apenas PIX, CARTAO_CREDITO e CARTAO_DEBITO.

- [ ] **TASK-FIN-002 (Backend)**: Implementar entidades JPA `Cobranca` e `Pagamento` com enums `StatusCobranca` e `FormaPagamento`.
  - *Critério de Aceite*: Anotações `@Entity`, validação de `BigDecimal` e relacionamento `@OneToOne` entre cobrança e pagamento.

- [ ] **TASK-FIN-003 (Backend)**: Implementar `CobrancaRepository` e `PagamentoRepository`.
  - *Critério de Aceite*: Queries de busca por vencimento e matrícula do aluno.

- [ ] **TASK-FIN-004 (Backend)**: Implementar serviço `CobrancaService` para geração automática de parcelas/faturas na criação da matrícula.
  - *Critério de Aceite*: Matrícula mensal gerando 1 cobrança; trimestral gerando 3 cobranças com vencimentos espaçados por mês.

- [ ] **TASK-FIN-005 (Backend)**: Implementar `PagamentoService` com liquidação de cobrança e prevenção de pagamento duplo.
  - *Critério de Aceite*: Testes unitários com simulação de concorrência garantindo idempotência e bloqueio de pagamento para cobrança já paga.

- [ ] **TASK-FIN-006 (Backend)**: Implementar `FinanceiroController` com endpoints de cobrança e quitação.
  - *Critério de Aceite*: Testes de API validando HTTP 200 na quitação e HTTP 422 caso forma de pagamento não seja aceita.

- [ ] **TASK-FIN-007 (Frontend)**: Criar `FinanceiroService` no Angular para listar cobranças e efetuar baixas.
  - *Critério de Aceite*: Integração com a API com tratamento de erros HTTP RFC 7807.

- [ ] **TASK-FIN-008 (Frontend)**: Construir `PagamentoModalComponent` com botões estilizados em Tailwind CSS para PIX, Cartão de Crédito e Cartão de Débito.
  - *Critério de Aceite*: Interface clara e objetiva para o operador selecionar o meio e confirmar a baixa em poucos cliques.

- [ ] **TASK-FIN-009 (Frontend)**: Construir tabela de faturas no painel do aluno e na ficha do recepcionista com badges de status coloridos.
  - *Critério de Aceite*: Visualização intuitiva de cobranças pendentes e quitadas.
