# Especificação de Domínio: Planos e Matrículas (Planos)

## 1. Visão Geral e Escopo
O domínio de **Planos e Matrículas** gerencia os produtos comercializados pela academia (planos de adesão) e o contrato de prestação de serviços com o aluno (matrícula). 

### Atores e Permissões
- **`ADMIN`**: Criar, alterar valores, periodicidades e desativar planos do catálogo.
- **`RECEPCIONISTA`**: Matricular alunos em planos disponíveis, renovar e cancelar matrículas.
- **`ALUNO`**: Consultar plano contratado, vigência atual e status da sua matrícula.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-PLA-001] (Event-driven)**: **QUANDO** um administrador cadastrar um plano, **O SISTEMA DEVE** registrar nome, descrição, valor da mensalidade recorrente (`valor_mensalidade`), periodicidade (MENSAL, TRIMESTRAL, ANUAL) e status ativo.
- **[EARS-PLA-002] (Event-driven)**: **QUANDO** um recepcionista matricular um aluno ativo em um plano ativo, **O SISTEMA DEVE** registrar a matrícula fixando o valor da mensalidade contratada, calculando a data de término conforme a periodicidade e gerando as cobranças mensais correspondentes (1 para mensal, 3 para trimestral, 12 para anual), todas no valor da mensalidade.
- **[EARS-PLA-003] (Unwanted behaviour)**: **SE** for solicitada uma matrícula para um aluno que já possui uma matrícula ativa no período, **ENTÃO O SISTEMA DEVE** bloquear a operação informando que o aluno já possui plano vigente (regra: 1 plano ativo por período).
- **[EARS-PLA-004] (Unwanted behaviour)**: **SE** for solicitada a matrícula de um aluno com status cadastral diferente de `ATIVO`, **ENTÃO O SISTEMA DEVE** rejeitar a matrícula.
- **[EARS-PLA-005] (State-driven)**: **ENQUANTO** a data corrente for superior à data de término da matrícula e ela não tiver sido renovada, **O SISTEMA DEVE** considerar a matrícula com status `VENCIDA`.
- **[EARS-PLA-006] (Event-driven)**: **QUANDO** uma matrícula for cancelada a pedido do aluno/recepcionista, **O SISTEMA DEVE** registrar a data de cancelamento, o motivo e alterar o status para `CANCELADA`.

### Requisitos Não Funcionais

- **[RNF-PLA-001]**: Precisão monetária obrigatória utilizando tipo `NUMERIC(10,2)` no PostgreSQL e `BigDecimal` no Java para evitar perdas de ponto flutuante.
- **[RNF-PLA-002]**: Cálculo determinístico de datas de expiração considerando anos bissextos e meses com diferentes números de dias (ex.: Java `LocalDate.plusMonths()`).

---

## 3. Casos de Borda e Regras de Negócio

1. **Unicidade de Matrícula Ativa**: Um aluno não pode ter duas matrículas com status `ATIVA` com vigências sobrepostas.
2. **Alteração de Preço de Plano**: A alteração de valor de um plano no catálogo não afeta contratos/matrículas já firmadas e vigentes (preserva o valor contratado).
3. **Desativação de Plano**: Desativar um plano impede novas matrículas naquele plano, mas mantém as matrículas vigentes em andamento até o fim do período.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Matrícula bem-sucedida de aluno
  Dado que o aluno "Mariana Oliveira" está com status "ATIVO"
  E o plano "Trimestral Fit" está ativo com duração de 3 meses
  Quando a recepcionista realiza a matrícula com data de início hoje
  Então o sistema registra a matrícula com status "ATIVA"
  E define a data de término exatamente daqui a 3 meses
  E retorna HTTP 201 Created

Cenário: Tentativa de matricular aluno com matrícula ativa vigente
  Dado que o aluno "Mariana Oliveira" já possui uma matrícula "ATIVA" com vigência até o próximo mês
  Quando for solicitada uma nova matrícula no mesmo período
  Então o sistema recusa a requisição com HTTP 409 Conflict
  E exibe a mensagem "O aluno já possui uma matrícula ativa no período"
```
