# Tarefas de Implementação: Planos e Matrículas (Planos)

## Checklist de Tarefas Atômicas

- [ ] **TASK-PLA-001 (DB)**: Criar migration Flyway `V3__create_tables_plano_e_matricula.sql` com enums, tabelas e foreign keys.
  - *Critério de Aceite*: Tabelas `tb_plano` e `tb_matricula` criadas com constraints de validação de valores positivos e datas.

- [ ] **TASK-PLA-002 (Backend)**: Implementar entidades JPA `Plano` e `Matricula` com enums `PeriodicidadePlano` e `StatusMatricula`.
  - *Critério de Aceite*: Relacionamentos `@ManyToOne` devidamente configurados e testados.

- [ ] **TASK-PLA-003 (Backend)**: Implementar `PlanoRepository` e `MatriculaRepository`.
  - *Critério de Aceite*: Métodos para busca de matrículas ativas por aluno e período (`existsByAlunoIdAndStatus`).

- [ ] **TASK-PLA-004 (Backend)**: Implementar `PlanoService` para CRUD e ativação/desativação de planos.
  - *Critério de Aceite*: Apenas `ROLE_ADMIN` autorizado a criar/modificar planos.

- [ ] **TASK-PLA-005 (Backend)**: Implementar `MatriculaService` com validação de unicidade de matrícula ativa (1 por aluno) e cálculo de vigência por periodicidade.
  - *Critério de Aceite*: Testes unitários bloqueando segunda matrícula ativa simultânea e calculando prazos corretamente (1, 3 e 12 meses).

- [ ] **TASK-PLA-006 (Backend)**: Implementar `PlanoController` e `MatriculaController`.
  - *Critério de Aceite*: Endpoints REST documentados e validados com testes de integração.

- [ ] **TASK-PLA-007 (Frontend)**: Criar `PlanoService` e `MatriculaService` no Angular com interfaces TypeScript.
  - *Critério de Aceite*: Serviços injetáveis com métodos para consulta de planos e gestão de matrículas.

- [ ] **TASK-PLA-008 (Frontend)**: Construir `PlanoCardsComponent` com Tailwind CSS exibindo planos, benefícios e valores.
  - *Critério de Aceite*: Layout responsivo em grid com destaque de planos populares.

- [ ] **TASK-PLA-009 (Frontend)**: Construir `MatriculaFlowComponent` integrando fluxo de matrícula do aluno com validação em tempo real.
  - *Critério de Aceite*: Notificação amigável de sucesso ou aviso de conflito se já matriculado.
