# Tarefas de Implementação: Colaboradores (Colaboradores)

## Fase 1: Banco de Dados e Infraestrutura
- [x] Criar migração Flyway `V8__create_table_colaborador.sql` com índices e constraints de chave estrangeira.
- [x] Criar entidade JPA `Colaborador.java` e repositório `ColaboradorRepository.java` com métodos de busca por CPF, e-mail e cargo.

## Fase 2: Backend e Serviços
- [x] Criar DTOs `ColaboradorCreateDTO`, `ColaboradorUpdateDTO`, `ColaboradorResponseDTO`.
- [x] Implementar `ColaboradorService.java`:
  - Validação de unicidade de CPF e E-mail.
  - Validação de obrigatoriedade de CREF para `ROLE_INSTRUTOR`.
  - Provisionamento automático de `Usuario` com perfil correspondente.
  - Regra de bloqueio de inativação do último administrador ativo.
- [x] Implementar `ColaboradorController.java` com anotações `@PreAuthorize("hasRole('ROLE_ADMIN')")`.

## Fase 3: Frontend Angular
- [x] Criar modelo de dados `colaborador.models.ts`.
- [x] Implementar `ColaboradorService` em `colaborador.service.ts` com Signals.
- [x] Criar componente `ColaboradorListComponent` para listagem e filtragem.
- [x] Criar componente `ColaboradorFormComponent` com validação reativa e campo condicional de CREF.
- [x] Adicionar rota `/colaboradores` em `app.routes.ts` com guard de acesso restrito a `ROLE_ADMIN`.
- [x] Atualizar menu de navegação da topbar e bottombar para exibir item "Colaboradores" para administradores.

## Fase 4: Testes e Homologação
- [x] Criar teste de integração backend `ColaboradorControllerTest.java` cobrindo regras de negócio e validações.
- [ ] Adicionar fluxo de colaboradores na suíte E2E do Playwright (`e2e-playwright-test.mjs`).
