# Tarefas de Implementação: Treinos e Exercícios (Treinos)

## Checklist de Tarefas Atômicas

- [ ] **TASK-TRE-001 (DB)**: Criar migration Flyway `V6__create_tables_treinos_e_exercicios.sql` com enums, tabelas e integridade referencial em cascata.
  - *Critério de Aceite*: Tabelas `tb_exercicio`, `tb_ficha_treino`, `tb_divisao_treino` e `tb_item_divisao` criadas com constraints.

- [ ] **TASK-TRE-002 (DB)**: Criar migration Flyway `V7__seed_catalogo_exercicios_iniciais.sql` com carga inicial de exercícios essenciais (Peito, Costas, Pernas, etc.).
  - *Critério de Aceite*: Mínimo de 30 exercícios clássicos populares pré-populados na base de dados.

- [ ] **TASK-TRE-003 (Backend)**: Implementar entidades JPA `Exercicio`, `FichaTreino`, `DivisaoTreino`, `ItemDivisao` e relacionamentos `@OneToMany` com cascata.
  - *Critério de Aceite*: Mapeamentos corretos de ciclo de vida com integridade referencial testada.

- [ ] **TASK-TRE-004 (Backend)**: Implementar `ExercicioRepository` e `FichaTreinoRepository`.
  - *Critério de Aceite*: Busca de ficha ativa por aluno e consulta de exercícios por grupo muscular.

- [ ] **TASK-TRE-005 (Backend)**: Implementar `FichaTreinoService` com regras de negócio (arquivamento de ficha anterior ao ativar uma nova, validação de catálogo).
  - *Critério de Aceite*: Teste unitário garantindo que a ativação de uma nova ficha altera o status da anterior para `HISTORICO`.

- [ ] **TASK-TRE-006 (Backend)**: Implementar `ExercicioController` e `FichaTreinoController`.
  - *Critério de Aceite*: Endpoints REST testados com MockMvc e validação de segurança RBAC (apenas instrutor/admin cria fichas).

- [ ] **TASK-TRE-007 (Frontend)**: Criar `TreinoService` no Angular consumindo os endpoints com tipagem TypeScript completa.
  - *Critério de Aceite*: Métodos para catálogo e operações de prescrição/consulta.

- [ ] **TASK-TRE-008 (Frontend)**: Construir `ExercicioCatalogoComponent` com Tailwind CSS e filtros rápidos por grupo muscular.
  - *Critério de Aceite*: Interface fluida e responsiva com busca rápida.

- [ ] **TASK-TRE-009 (Frontend)**: Construir `FichaPrescricaoFormComponent` com formulário reativo com arrays aninhados (`FormArray` de divisões e itens).
  - *Critério de Aceite*: Instrutor consegue adicionar e remover divisões A, B, C e selecionar exercícios com facilidade.

- [ ] **TASK-TRE-010 (Frontend)**: Construir `FichaVisualizacaoMobileComponent` otimizado para o aplicativo do aluno no smartphone.
  - *Critério de Aceite*: Navegação ágil entre divisões de treino (Tabs), visualização clara de carga e descanso.

- [ ] **TASK-TRE-011 (Backend)**: Implementar entidade `RegistroExecucaoTreino`, repositório e endpoints `/api/v1/treinos/execucoes` e `/api/v1/alunos/me/evolucao-cargas`.
  - *Critério de Aceite*: Aluno autenticado consegue persistir sua carga/repetições executadas e consultar histórico.

- [ ] **TASK-TRE-012 (Frontend)**: Implementar componente de registro rápido de carga durante o treino e visualizador gráfico simples de progressão de carga.
  - *Critério de Aceite*: Input ágil de peso no card do exercício do celular e tela de gráfico de progressão.
