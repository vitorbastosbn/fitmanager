# Tarefas de Implementação: Alunos (Alunos)

## Checklist de Tarefas Atômicas

- [ ] **TASK-ALU-001 (DB)**: Criar migration Flyway `V2__create_table_aluno.sql` com schema, restrições e índices de performance.
  - *Critério de Aceite*: Tabela criada no Postgres com foreign key para `tb_usuario` e unique key em `cpf`.

- [ ] **TASK-ALU-002 (Backend)**: Implementar entidade `Aluno`, enum `StatusAluno` e mapeamento JPA com `@Embedded` ou colunas de endereço.
  - *Critério de Aceite*: Mapeamento correto e integridade referencial testada.

- [ ] **TASK-ALU-003 (Backend)**: Criar validador customizado Bean Validation `@CPF` para checagem dos dígitos verificadores.
  - *Critério de Aceite*: Testes unitários com CPFs válidos e inválidos.

- [ ] **TASK-ALU-004 (Backend)**: Implementar `AlunoRepository` com suporte a `JpaSpecificationExecutor` para busca dinâmica.
  - *Critério de Aceite*: Consulta filtrando por nome parcial, status e CPF retornando paginação correta.

- [ ] **TASK-ALU-005 (Backend)**: Implementar `AlunoService` com regras de cadastro, verificação de duplicidade de CPF e inativação lógica.
  - *Critério de Aceite*: Testes unitários cobrindo fluxos de sucesso e exceções de negócio (`RegraNegocioException`).

- [ ] **TASK-ALU-006 (Backend)**: Implementar `AlunoController` com endpoints REST e anotações `@PreAuthorize`.
  - *Critério de Aceite*: Testes com MockMvc validando autorização por perfil e payloads de retorno.

- [ ] **TASK-ALU-007 (Frontend)**: Criar `AlunoService` no Angular consumindo a API com tipagem TypeScript estrita.
  - *Critério de Aceite*: Métodos para listagem com paginação, busca por id, criação e atualização.

- [ ] **TASK-ALU-008 (Frontend)**: Construir `AlunoListComponent` com Tailwind CSS, busca reativa (Signals/RxJS debounce) e paginação.
  - *Critério de Aceite*: Listagem limpa, estilizada e com feedback visual de carregamento.

- [ ] **TASK-ALU-009 (Frontend)**: Construir `AlunoFormComponent` com validação de CPF e campos reativos.
  - *Critério de Aceite*: Formulário bloqueando submissão caso CPF ou campos obrigatórios sejam inválidos.
