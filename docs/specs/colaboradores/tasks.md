# Tarefas de Implementação: Colaboradores (Colaboradores)

## Fase 1: Banco de Dados e Infraestrutura
- [ ] Criar migração Flyway `V8__create_table_colaborador.sql` com índices e constraints de chave estrangeira.
- [ ] Criar entidade JPA `Colaborador.java` e repositório `ColaboradorRepository.java` com métodos de busca por CPF, e-mail e cargo.

## Fase 2: Backend e Serviços
- [ ] Criar DTOs `ColaboradorCreateDTO`, `ColaboradorUpdateDTO`, `ColaboradorResponseDTO`.
- [ ] Implementar `ColaboradorService.java`:
  - Validação de unicidade de CPF e E-mail.
  - Validação de obrigatoriedade de CREF para `ROLE_INSTRUTOR`.
  - Provisionamento automático de `Usuario` com perfil correspondente.
  - Regra de bloqueio de inativação do último administrador ativo.
- [ ] Implementar `ColaboradorController.java` com anotações `@PreAuthorize("hasRole('ROLE_ADMIN')")`.

## Fase 3: Frontend Angular
- [ ] Criar modelo de dados `colaborador.models.ts`.
- [ ] Implementar `ColaboradorService` em `colaborador.service.ts` com Signals.
- [ ] Criar componente `ColaboradorListComponent` para listagem e filtragem.
- [ ] Criar componente `ColaboradorFormComponent` com validação reativa e campo condicional de CREF.
- [ ] Adicionar rota `/colaboradores` em `app.routes.ts` com guard de acesso restrito a `ROLE_ADMIN`.
- [ ] Atualizar menu de navegação da topbar e bottombar para exibir item "Colaboradores" para administradores.

## Fase 4: Testes e Homologação
- [ ] Criar teste de integração backend `ColaboradorControllerTest.java` cobrindo regras de negócio e validações.
- [ ] Adicionar fluxo de colaboradores na suíte E2E do Playwright (`e2e-playwright-test.mjs`).
