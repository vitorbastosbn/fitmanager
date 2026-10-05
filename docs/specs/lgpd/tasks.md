# Tarefas de Implementação: Conformidade LGPD (LGPD)

## Fase 1: Banco de Dados e Migração Flyway
- [x] Criar migração Flyway `V9__criar_tabelas_lgpd.sql` com:
  - `tb_termo_consentimento`
  - `tb_consentimento_usuario`
  - `tb_log_auditoria_lgpd`
  - Carga inicial da Política de Privacidade v1.0.

## Fase 2: Backend Spring Boot
- [x] Criar entidades JPA: `TermoConsentimento.java`, `ConsentimentoUsuario.java`, `LogAuditoriaLgpd.java`.
- [x] Criar repositórios Spring Data JPA: `TermoConsentimentoRepository`, `ConsentimentoUsuarioRepository`, `LogAuditoriaLgpdRepository`.
- [x] Implementar `LgpdService.java` com métodos:
  - `obterTermoVigenteComStatus(Long usuarioId)`
  - `registrarAceiteTermo(Long usuarioId, Long termoId, String ipOrigem, String userAgent)`
  - `exportarDadosCompletos(Long usuarioId)`
  - `anonimizarTitular(Long usuarioId, String motivo)`
  - `registrarAuditoria(Long operadorId, Long titularId, String acao, String detalhes, String ip)`
- [x] Criar `LgpdController.java` mapeando os endpoints em `/api/v1/lgpd/*`.
- [x] Garantir validação de faturas pendentes antes de permitir a anonimização.

## Fase 3: Frontend Angular
- [x] Criar `lgpd.service.ts` para chamadas aos endpoints de consentimento, exportação e auditoria.
- [x] Criar componente modal `ConsentimentoModalComponent` que bloqueia navegação se o usuário não aceitou o termo vigente.
- [x] Criar seção "Privacidade e Meus Dados (LGPD)" na tela de perfil do aluno com:
  - Botão de download "Exportar Meus Dados (JSON)".
  - Botão de solicitação "Anonimizar Meus Dados (Direito ao Esquecimento)" com confirmação por modal e aviso de perda de acesso irreversível.
- [x] Criar tela de auditoria LGPD para administradores (`/admin/lgpd-auditoria`).
- [x] Aplicar pipe ou máscara de formatação para ocultar dígitos de CPF (`MascararCpfPipe`).

## Fase 4: Testes e Validação
- [x] Criar testes unitários e de integração `LgpdIntegrationTest.java` validando exportação JSON, bloqueio de anonimização com faturas abertas e integridade da substituição dos dados.
- [x] Criar testes E2E do fluxo de consentimento e download dos dados no Playwright.
