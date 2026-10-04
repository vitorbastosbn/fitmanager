# Tarefas de Implementação: Frequência e Check-in (Frequencia)

## Checklist de Tarefas Atômicas

- [ ] **TASK-FRQ-001 (DB)**: Criar migration Flyway `V5__create_table_checkin.sql` com enum de status de acesso, colunas e índices.
  - *Critério de Aceite*: Tabela `tb_checkin` criada no PostgreSQL com chave única no `token_nonce` e índice composto para auditoria.

- [ ] **TASK-FRQ-002 (Backend)**: Implementar entidade JPA `CheckIn` e enum `StatusAcessoCheckin`.
  - *Critério de Aceite*: Mapeamento correto e testes de persistência.

- [ ] **TASK-FRQ-003 (Backend)**: Implementar `QrTokenService` responsável por assinar e validar tokens efêmeros de check-in com HMAC SHA-256 e nonce.
  - *Critério de Aceite*: Testes unitários validando expiração em 60s e rejeição de token adulterado ou já consumido (nonce duplicado).

- [ ] **TASK-FRQ-004 (Backend)**: Implementar `FrequenciaService` com as regras de validação (matrícula ativa, consulta de pendências financeiras com bloqueio se atraso > 5 dias corridos e intervalo mínimo de 30 minutos entre check-ins).
  - *Critério de Aceite*: Testes unitários para casos de sucesso, bloqueio por matrícula inativa, liberação com atraso <= 5 dias e bloqueio com atraso > 5 dias.

- [ ] **TASK-FRQ-005 (Backend)**: Implementar `FrequenciaController` com endpoints `/qrcode-token`, `/check-in` e `/hoje`.
  - *Critério de Aceite*: Testes de integração validando tempo de resposta < 200ms e retorno de payloads padronizados.

- [ ] **TASK-FRQ-006 (Frontend)**: Construir `AlunoQrCodeComponent` com renderizador SVG de QR Code e temporizador visual de 60s em Angular Signals.
  - *Critério de Aceite*: QR Code exibido com clareza, atualizando silenciosamente o token antes de expirar.

- [ ] **TASK-FRQ-007 (Frontend)**: Construir `TerminalScannerComponent` para a recepção com Tailwind CSS, campo com foco automático para leitor USB e suporte a câmera web.
  - *Critério de Aceite*: Feedback visual instantâneo em tela cheia (Verde = Liberado com nome do aluno; Vermelho = Negado com motivo).

- [ ] **TASK-FRQ-008 (Frontend)**: Construir `HistoricoPresencaComponent` listando entradas do dia com paginação e busca por aluno.
  - *Critério de Aceite*: Atualização em tempo real da lista de entradas do dia.
