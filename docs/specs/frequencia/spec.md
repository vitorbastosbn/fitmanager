# Especificação de Domínio: Frequência e Check-in (Frequencia)

## 1. Visão Geral e Escopo
O domínio de **Frequência e Check-in** é responsável pelo controle de acesso físico dos alunos à academia. O mecanismo aprovado para o MVP baseia-se na **leitura de QR Code gerado no aplicativo/portal do aluno**, validado pelo leitor/terminal da recepção.

### Atores e Permissões
- **`ALUNO`**: Gerar e exibir na tela do smartphone o QR Code dinâmico/temporário de acesso pessoal.
- **`RECEPCIONISTA`**: Operar o terminal/leitor de recepção que valida o QR Code ou consultar histórico de presença do dia.
- **`ADMIN` e `INSTRUTOR`**: Consultar histórico e relatórios de frequência de alunos.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-FRQ-001] (Event-driven)**: **QUANDO** um aluno autenticado solicitar seu código de acesso no aplicativo, **O SISTEMA DEVE** gerar um token de check-in efêmero assinado criptograficamente com validade curta (ex.: 60 segundos) e exibi-lo como QR Code.
- **[EARS-FRQ-002] (Event-driven)**: **QUANDO** o terminal da recepção ler e submeter o payload do QR Code, **O SISTEMA DEVE** validar a assinatura, a expiração do token, se o aluno possui matrícula com status `ATIVA` e se não possui cobranças atrasadas há mais de 5 dias corridos.
- **[EARS-FRQ-003] (State-driven)**: **ENQUANTO** o aluno possuir matrícula `ATIVA`, nenhuma cobrança atrasada por mais de 5 dias corridos e o token estiver válido, **O SISTEMA DEVE** registrar o check-in com timestamp atual e retornar status de acesso liberado (`LIBERADO`).
- **[EARS-FRQ-004] (Unwanted behaviour)**: **SE** o QR Code estiver expirado, inválido ou corrompido, **ENTÃO O SISTEMA DEVE** negar o acesso retornando código de erro específico `QRCODE_INVALIDO_OU_EXPIRADO`.
- **[EARS-FRQ-005] (Unwanted behaviour)**: **SE** o aluno vinculado ao QR Code não possuir matrícula ativa vigente, **ENTÃO O SISTEMA DEVE** negar o acesso retornando `MATRICULA_INEXISTENTE_OU_VENCIDA`.
- **[EARS-FRQ-006] (Unwanted behaviour)**: **SE** o aluno possuir uma ou mais cobranças com atraso superior a 5 dias corridos em relação ao vencimento, **ENTÃO O SISTEMA DEVE** bloquear o acesso retornando o motivo específico `INADIMPLENCIA_TOLERANCIA_EXCEDIDA`.
- **[EARS-FRQ-007] (Event-driven)**: **QUANDO** um check-in for registrado com sucesso, **O SISTEMA DEVE** emitir resposta instantânea para o terminal da recepção contendo nome do aluno, foto (se disponível) e horário de entrada.

### Requisitos Não Funcionais

- **[RNF-FRQ-001]**: Latência máxima de validação do check-in de 200ms para evitar filas na catraca/recepção.
- **[RNF-FRQ-002]**: Segurança contra reutilização: cada token de QR Code só pode ser utilizado para um único check-in (*one-time use* / nonce).
- **[RNF-FRQ-003]**: Funcionar em dispositivos móveis modernos sem necessidade de hardware biométrico dedicado no MVP.

---

## 3. Casos de Borda e Regras de Negócio

1. **Janela de Tolerância de Repetição**: Um aluno não pode realizar dois check-ins consecutivos no intervalo inferior a 30 minutos (evita dupla leitura acidental no scanner).
2. **Token Efêmero**: O QR Code possui validade de 60 segundos com atualização automática no app do aluno (evita prints estáticos compartilhados entre pessoas diferentes).
3. **Bloqueio por Inadimplência com Tolerância de 5 Dias**:
   - Atrasos de até 5 dias corridos após o vencimento da cobrança: Acesso `LIBERADO` (período de tolerância).
   - Atrasos superiores a 5 dias corridos: Acesso `BLOQUEADO` automaticamente no leitor com motivo `INADIMPLENCIA_TOLERANCIA_EXCEDIDA`.
   - Matrícula com status `VENCIDA` ou `CANCELADA`: Acesso `BLOQUEADO` imediatamente com motivo `MATRICULA_INEXISTENTE_OU_VENCIDA`.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Check-in bem-sucedido via QR Code
  Dado que o aluno "Mariana Oliveira" possui matrícula "ATIVA"
  E gerou um QR Code válido com seu token temporário
  Quando o leitor da recepção envia o QR Code para "/api/v1/frequencia/check-in"
  Então o sistema registra a presença na base de dados
  E responde com HTTP 200 OK informando "Acesso Liberado" e os dados da aluna

Cenário: Tentativa de check-in com QR Code expirado
  Dado que o aluno gerou o QR Code há mais de 60 segundos
  Quando o leitor da recepção tentar ler o código
  Então o sistema recusa o acesso com HTTP 400 Bad Request
  E informa "QR Code expirado. Por favor, gere um novo código no aplicativo."
```
