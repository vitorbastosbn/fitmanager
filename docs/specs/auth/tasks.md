# Tarefas de Implementação: Autenticação e Perfis (Auth)

## Checklist de Tarefas Atômicas

- [ ] **TASK-AUTH-001 (DB)**: Criar migration Flyway `V1__create_table_usuario.sql` com schema, enum de perfis e índices.
  - *Critério de Aceite*: Migração executada com sucesso no Postgres; restrição de unicidade em `email` e enum criados.

- [ ] **TASK-AUTH-002 (Backend)**: Implementar entidade JPA `Usuario` e enum `TipoPerfil`.
  - *Critério de Aceite*: Mapeamento correto com anotações `@Entity`, `@Enumerated(EnumType.STRING)` e validações Bean Validation.

- [ ] **TASK-AUTH-003 (Backend)**: Implementar `UsuarioRepository` com método `findByEmail(String email)`.
  - *Critério de Aceite*: Teste de integração `@DataJpaTest` validando busca e retorno de `Optional<Usuario>`.

- [ ] **TASK-AUTH-004 (Backend)**: Configurar `SecurityFilterChain` no Spring Boot 4.1.1 com BCrypt e desabilitação de CSRF para API stateless.
  - *Critério de Aceite*: Rotas públicas (`/api/v1/auth/login`) acessíveis sem token; rotas protegidas retornando 401 sem header.

- [ ] **TASK-AUTH-005 (Backend)**: Implementar `JwtTokenProvider` e `JwtAuthenticationFilter`.
  - *Critério de Aceite*: Teste unitário gerando e validando claims, expiração e assinatura do token.

- [ ] **TASK-AUTH-006 (Backend)**: Implementar `AuthController` e `AuthenticationService` com endpoints `/api/v1/auth/login` e `/api/v1/auth/me`.
  - *Critério de Aceite*: Teste de ponta a ponta (`@SpringBootTest`) validando login bem-sucedido e rejeição de credenciais incorretas.

- [ ] **TASK-AUTH-007 (Frontend)**: Criar `AuthService` com Angular Signals, gerenciamento de token no localStorage/sessionStorage e decodificação de perfil.
  - *Critério de Aceite*: Método de login atualizando signal reativo e notificando componentes.

- [ ] **TASK-AUTH-008 (Frontend)**: Implementar `AuthInterceptor`, `AuthGuard` e `RoleGuard`.
  - *Critério de Aceite*: Requisições anexando token automaticamente; navegação redirecionando para login se não autenticado.

- [ ] **TASK-AUTH-009 (Frontend)**: Criar tela `LoginComponent` com formulário reativo e estilização em Tailwind CSS.
  - *Critério de Aceite*: Layout responsivo, exibição de erros de validação e feedback visual durante requisição.

- [ ] **TASK-AUTH-010 (Backend)**: Implementar endpoint `/api/v1/auth/alterar-senha-primeiro-acesso` e validação da flag `primeiroAcesso`.
  - *Critério de Aceite*: Atualização do hash de senha com BCrypt e desativação da flag `primeiroAcesso = false`.

- [ ] **TASK-AUTH-011 (Frontend)**: Criar modal/tela de `PrimeiroAcessoComponent` forçando redefinição de senha logo após o primeiro login.
  - *Critério de Aceite*: Usuário com `primeiroAcesso = true` impedido de navegar para o dashboard antes de definir a nova senha.
