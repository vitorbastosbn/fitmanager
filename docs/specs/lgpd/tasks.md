# Tarefas de Implementação: Conformidade LGPD (LGPD)

## Fase 1: Banco de Dados e Migração Flyway
- [ ] Criar migração Flyway `V9__criar_tabelas_lgpd.sql` com:
  - `tb_termo_consentimento`
  - `tb_consentimento_usuario`
  - `tb_log_auditoria_lgpd`
  - Carga inicial da Política de Privacidade v1.0.

## Fase 2: Backend Spring Boot
- [ ] Criar entidades JPA: `TermoConsentimento.java`, `ConsentimentoUsuario.java`, `LogAuditoriaLgpd.java`.
- [ ] Criar repositórios Spring Data JPA: `TermoConsentimentoRepository`, `ConsentimentoUsuarioRepository`, `LogAuditoriaLgpdRepository`.
- [ ] Implementar `LgpdService.java` com métodos:
  - `obterTermoVigenteComStatus(Long usuarioId)`
  - `registrarAceiteTermo(Long usuarioId, Long termoId, String ipOrigem, String userAgent)`
  - `exportarDadosCompletos(Long usuarioId)`
  - `anonimizarTitular(Long usuarioId, String motivo)`
  - `registrarAuditoria(Long operadorId, Long titularId, String acao, String detalhes, String ip)`
- [ ] Criar `LgpdController.java` mapeando os endpoints em `/api/v1/lgpd/*`.
- [ ] Garantir validação de faturas pendentes antes de permitir a anonimização.

## Fase 3: Frontend Angular
- [ ] Criar `lgpd.service.ts` para chamadas aos endpoints de consentimento, exportação e auditoria.
- [ ] Criar componente modal `ConsentimentoModalComponent` que bloqueia navegação se o usuário não aceitou o termo vigente.
- [ ] Criar seção "Privacidade e Meus Dados (LGPD)" na tela de perfil do aluno com:
  - Botão de download "Exportar Meus Dados (JSON)".
  - Botão de solicitação "Anonimizar Meus Dados (Direito ao Esquecimento)" com confirmação por modal e aviso de perda de acesso irreversível.
- [ ] Criar tela de auditoria LGPD para administradores (`/admin/lgpd-auditoria`).
- [ ] Aplicar pipe ou máscara de formatação para ocultar dígitos de CPF (`MascararCpfPipe`).

## Fase 4: Testes e Validação
- [ ] Criar testes unitários e de integração `LgpdIntegrationTest.java` validando exportação JSON, bloqueio de anonimização com faturas abertas e integridade da substituição dos dados.
- [ ] Criar testes E2E do fluxo de consentimento e download dos dados no Playwright.
