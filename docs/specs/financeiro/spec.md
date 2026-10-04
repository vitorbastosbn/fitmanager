# Especificação de Domínio: Financeiro Básico (Financeiro)

## 1. Visão Geral e Escopo
O domínio **Financeiro** do MVP gerencia a emissão de cobranças referentes às matrículas e o registro de pagamentos realizados. Nesta fase do MVP, o registro de recebimentos é suportado exclusivamente pelas seguintes formas de pagamento definidas: **PIX**, **Cartão de Crédito** e **Cartão de Débito**.

### Atores e Permissões
- **`ADMIN` e `RECEPCIONISTA`**: Consultar cobranças, registrar pagamentos manuais (comprovante/transação de maquininha ou PIX) e emitir recibos.
- **`ALUNO`**: Consultar seu histórico de cobranças e faturas pendentes ou pagas.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-FIN-001] (Event-driven)**: **QUANDO** uma matrícula for confirmada no sistema, **O SISTEMA DEVE** gerar as cobranças correspondentes ao plano com valor, data de vencimento e status inicial `PENDENTE`.
- **[EARS-FIN-002] (Event-driven)**: **QUANDO** o operador registrar a quitação de uma cobrança informando o meio de pagamento (PIX, CARTAO_CREDITO ou CARTAO_DEBITO), **O SISTEMA DEVE** alterar o status para `PAGO`, salvar a data/hora do pagamento e registrar o usuário recebedor.
- **[EARS-FIN-003] (Unwanted behaviour)**: **SE** for tentado o registro de pagamento com um método diferente de PIX, Cartão de Crédito ou Cartão de Débito, **ENTÃO O SISTEMA DEVE** recusar a operação com HTTP 422 Unprocessable Entity.
- **[EARS-FIN-004] (Unwanted behaviour)**: **SE** for submetido um pagamento para uma cobrança que já consta como `PAGO` ou `CANCELADO`, **ENTÃO O SISTEMA DEVE** rejeitar a operação para evitar duplicidade financeira.
- **[EARS-FIN-005] (State-driven)**: **ENQUANTO** a data atual for posterior à data de vencimento de uma cobrança com status `PENDENTE`, **O SISTEMA DEVE** sinalizar a cobrança como `ATRASADA` nas consultas e relatórios.
- **[EARS-FIN-006] (Event-driven)**: **QUANDO** uma matrícula for cancelada, **O SISTEMA DEVE** cancelar automaticamente as cobranças futuras que ainda estiverem `PENDENTE`.

### Requisitos Não Funcionais

- **[RNF-FIN-001]**: Auditoria e rastreabilidade total: cada registro de pagamento deve identificar o `usuario_recebedor_id`, código de autorização/transação externa (se houver) e timestamp com fuso horário.
- **[RNF-FIN-002]**: Precisão monetária inegociável com `NUMERIC(10,2)` no banco e `BigDecimal` no backend.

---

## 3. Casos de Borda e Regras de Negócio

1. **Métodos Permitidos no MVP**: Apenas `PIX`, `CARTAO_CREDITO` e `CARTAO_DEBITO`. Pagamentos em dinheiro vivo ou boletos não entram no escopo deste MVP.
2. **Estorno / Cancelamento**: Cobranças pagas não podem ser deletadas. Em caso de erro de digitação, exige-se perfil `ADMIN` para estorno documentado.
3. **Idempotência**: Requisições de registro de pagamento devem suportar chave de idempotência ou validação de estado para evitar duplo clique na recepção.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Registro de pagamento via PIX com sucesso
  Dado que existe uma cobrança com status "PENDENTE" no valor de R$ 120,00
  Quando a recepcionista registra o pagamento selecionando método "PIX"
  Então o status da cobrança passa para "PAGO"
  E a data de pagamento é registrada com o timestamp atual
  E o sistema retorna HTTP 200 OK com o recibo gerado

Cenário: Tentativa de registrar pagamento já quitado
  Dado que a cobrança já possui status "PAGO"
  Quando o operador tentar registrar novamente o pagamento
  Então o sistema recusa a operação com HTTP 400 Bad Request
  E exibe a mensagem "Cobrança já se encontra liquidada"
```
