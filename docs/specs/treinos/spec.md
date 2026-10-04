# Especificação de Domínio: Treinos e Exercícios (Treinos)

## 1. Visão Geral e Escopo
O domínio de **Treinos e Exercícios** gerencia a prescrição esportiva da academia. Ele abrange a manutenção do **catálogo central de exercícios** (com grupo muscular e orientações) e a elaboração de **fichas de treino personalizadas** organizadas nas divisões clássicas (**Treino A, Treino B, Treino C...**), onde cada item contém o exercício selecionado, número de séries, repetições, carga (kg) e tempo de descanso em segundos.

### Atores e Permissões
- **`INSTRUTOR` e `ADMIN`**: Cadastrar exercícios no catálogo, prescrever novas fichas para alunos, editar fichas vigentes e definir divisões de treino.
- **`ALUNO`**: Consultar suas fichas de treino ativas, visualizar a execução das divisões e registrar evolução de carga pessoal.
- **`RECEPCIONISTA`**: Consulta básica de fichas de treino de alunos.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-TRE-001] (Event-driven)**: **QUANDO** um instrutor cadastrar um exercício no catálogo, **O SISTEMA DEVE** persistir o nome, grupo muscular principal (PEITO, COSTAS, PERNAS, OMBROS, BRACOS, ABDOMEN, CARDIO) e instruções de execução.
- **[EARS-TRE-002] (Event-driven)**: **QUANDO** um instrutor criar uma ficha de treino para um aluno ativo, **O SISTEMA DEVE** associar a ficha ao aluno e ao instrutor criador, registrando data de início, data de validade estimada e objetivo (ex: Hipertrofia, Emagrecimento, Condicionamento).
- **[EARS-TRE-003] (State-driven)**: **ENQUANTO** a ficha estiver sendo composta, **O SISTEMA DEVE** permitir a inclusão de divisões identificadas por letras (ex.: "A - Peito e Tríceps", "B - Costas e Bíceps", "C - Pernas").
- **[EARS-TRE-004] (Event-driven)**: **QUANDO** um item for adicionado a uma divisão de treino, **O SISTEMA DEVE** vincular obrigatoriamente um exercício do catálogo pré-cadastrado e registrar séries (int > 0), repetições (ex: "10-12" ou "12"), carga em kg (numeric >= 0) e tempo de descanso em segundos (int > 0).
- **[EARS-TRE-005] (Unwanted behaviour)**: **SE** for tentada a criação de uma ficha para um aluno com status cadastral inativo, **ENTÃO O SISTEMA DEVE** rejeitar a operação.
- **[EARS-TRE-006] (Event-driven)**: **QUANDO** uma nova ficha for ativada para um aluno, **O SISTEMA DEVE** arquivar automaticamente a ficha anterior do mesmo aluno como `HISTORICO`.
- **[EARS-TRE-007] (Event-driven)**: **QUANDO** um aluno autenticado concluir um exercício da sua divisão e registrar a carga executada, **O SISTEMA DEVE** persistir o log de execução com a data/hora, o item do treino executado, a carga real utilizada (kg) e repetições cumpridas para acompanhamento de progressão.

### Requisitos Não Funcionais

- **[RNF-TRE-001]**: Interface do aluno responsiva e otimizada para uso em smartphones dentro da academia (visualização rápida de ficha de treino sem cliques desnecessários).
- **[RNF-TRE-002]**: Ordenação preservada dos exercícios dentro de cada divisão via campo de sequência/ordem (`ordem_execucao INT`).

---

## 3. Casos de Borda e Regras de Negócio

1. **Catálogo Pré-cadastrado Obrigatório**: Não é permitido texto livre avulso para nome de exercício nas divisões; o exercício deve existir previamente na base para viabilizar relatórios futuros de evolução.
2. **Histórico Preservado**: Fichas antigas nunca são excluídas fisicamente; elas ficam marcadas com status `INATIVA` ou `HISTORICO` para permitir que o aluno e o professor vejam a progressão de cargas ao longo dos meses.
3. **Carga Zero**: Carga igual a 0 kg é permitida para exercícios que utilizam peso corporal (ex.: flexões de braço, barra fixa, abdominais).

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Prescrição de ficha de treino com divisões A e B
  Dado que o instrutor está autenticado com "ROLE_INSTRUTOR"
  E o aluno "Mariana Oliveira" está cadastrado e ativo
  Quando o instrutor cria uma ficha com objetivo "Hipertrofia"
  E adiciona Divisão A com exercício "Supino Reto", 4 séries, 10 reps, 30kg, descanso 60s
  E adiciona Divisão B com exercício "Puxada Frontal", 4 séries, 12 reps, 40kg, descanso 60s
  Então o sistema persiste a ficha com status "ATIVA"
  E a aluna Mariana passa a visualizar as divisões no seu aplicativo

Cenário: Aluno consultando sua ficha no celular
  Dado que a aluna Mariana está autenticada no aplicativo
  Quando ela acessar a aba "Meus Treinos"
  Então o sistema retorna a ficha ativa organizada por divisões (A, B, C...)
  E exibe os detalhes de cada exercício de forma clara
```
