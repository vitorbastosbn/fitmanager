# Especificação de Domínio: Dashboard Analítico (Dashboard)

## 1. Visão Geral e Escopo
O domínio de **Dashboard** fornece painéis executivos e operacionais com métricas agregadas em tempo real, adaptadas dinamicamente de acordo com o perfil de acesso do usuário autenticado (`ADMIN`, `RECEPCIONISTA`, `INSTRUTOR`, `ALUNO`). O objetivo é dar visibilidade imediata às tarefas críticas e indicadores de desempenho da academia.

---

## 2. Requisitos por Perfil de Acesso (Notação EARS)

### 2.1 Perfil ADMIN (Visão Executiva e Estratégica)
- **[EARS-DSH-ADM-001] (Event-driven)**: **QUANDO** o administrador acessar o dashboard, **O SISTEMA DEVE** exibir:
  1. Total de alunos ativos, inativos e trancados.
  2. Faturamento consolidado do mês corrente (R$) e faturas a receber.
  3. Taxa de inadimplência (% de cobranças vencidas há mais de 5 dias).
  4. Volume total de check-ins registrados hoje e gráfico de fluxo por faixa de horário.
  5. Total de colaboradores ativos divididos por função.

### 2.2 Perfil RECEPCIONISTA (Visão Operacional de Portaria)
- **[EARS-DSH-REC-001] (Event-driven)**: **QUANDO** o recepcionista acessar o dashboard, **O SISTEMA DEVE** exibir:
  1. Contador de check-ins autorizados hoje vs bloqueados hoje.
  2. Lista dos últimos 5 bloqueios na catraca com motivo do bloqueio (ex: inadimplência > 5 dias).
  3. Matrículas com vencimento programado para os próximos 7 dias (para renovação ativa).
  4. Novos alunos cadastrados no dia de hoje.

### 2.3 Perfil INSTRUTOR (Visão Técnica Esportiva)
- **[EARS-DSH-INS-001] (Event-driven)**: **QUANDO** o instrutor acessar o dashboard, **O SISTEMA DEVE** exibir:
  1. Total de alunos com fichas sob sua autoria.
  2. Fichas de treino que expiram nos próximos 15 dias (necessidade de reavaliação).
  3. Alunos ativos recém-matriculados sem nenhuma ficha de treino cadastrada.
  4. Total de registros de treino e cargas submetidos pelos alunos no dia de hoje.

### 2.4 Perfil ALUNO (Visão Pessoal de Desempenho e Engajamento)
- **[EARS-DSH-ALU-001] (Event-driven)**: **QUANDO** o aluno acessar seu dashboard, **O SISTEMA DEVE** exibir:
  1. Frequência na semana atual (ex: 4 de 7 dias treinados) e sequência ininterrupta (*streak* em dias).
  2. Total de treinos realizados no mês.
  3. Divisão de treino recomendada para o dia (ex: Divisão B - Costas e Bíceps).
  4. Status da matrícula atual e data da próxima renovação.
  5. Próxima fatura com valor, vencimento e botão direto para quitação via PIX se estiver pendente.

---

## 3. Requisitos Não Funcionais

- **[RNF-DSH-001]**: Tempo de resposta do endpoint consolidado de dashboard inferior a 350ms através de consultas indexadas e agregações otimizadas no PostgreSQL.
- **[RNF-DSH-002]**: Renderização reativa no Angular com micro-animações, cards em glassmorphism e cores condicionais (verde para positivo, vermelho/âmbar para alertas).
- **[RNF-DSH-003]**: Cache leve em memória de 60 segundos para métricas agregadas pesadas de faturamento e fluxo histórico.

---

## 4. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Carregamento do dashboard administrativo
  Dado que um usuário autenticado com perfil "ROLE_ADMIN" acessa "/dashboard"
  Quando a requisição GET "/api/v1/dashboard/admin" for processada
  Então o sistema retorna HTTP 200 OK com indicadores de faturamento, total de alunos, inadimplência e colaboradores
  E a interface renderiza os 4 cards principais de KPI e o gráfico de frequência diária

Cenário: Aluno consulta seu progresso semanal
  Dado que um aluno autenticado acessa seu painel
  Quando a requisição GET "/api/v1/dashboard/aluno" for processada
  Então o sistema retorna a quantidade de treinos da semana, streak atual e a divisão de treino sugerida para hoje
```
