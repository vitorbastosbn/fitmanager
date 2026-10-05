# Design Técnico: Dashboard Analítico (Dashboard)

## 1. Arquitetura de Endpoints e DTOs

O backend centraliza a agregação em um controlador unificado com endpoints segmentados por perfil, aproveitando permissões do Spring Security:

```
GET /api/v1/dashboard/admin         -> DashboardAdminDTO (PreAuthorize: ROLE_ADMIN)
GET /api/v1/dashboard/recepcao      -> DashboardRecepcaoDTO (PreAuthorize: ROLE_ADMIN, ROLE_RECEPCIONISTA)
GET /api/v1/dashboard/instrutor     -> DashboardInstrutorDTO (PreAuthorize: ROLE_ADMIN, ROLE_INSTRUTOR)
GET /api/v1/dashboard/aluno         -> DashboardAlunoDTO (PreAuthorize: ROLE_ALUNO)
```

### 1.1 Estrutura do `DashboardAdminDTO`

```java
public record DashboardAdminDTO(
    long totalAlunosAtivos,
    long totalAlunosInativos,
    BigDecimal faturamentoMesAtual,
    BigDecimal faturamentoMesAnterior,
    BigDecimal valorEmAtraso,
    double taxaInadimplencia,
    long checkInsHoje,
    long totalColaboradoresAtivos,
    List<FluxoHorarioDTO> fluxoPorHorario
) {}

public record FluxoHorarioDTO(int hora, long quantidadeCheckIns) {}
```

### 1.2 Estrutura do `DashboardAlunoDTO`

```java
public record DashboardAlunoDTO(
    int treinosSemanaAtual,
    int streakDiasConsecutivos,
    int totalCheckInsMes,
    String proximaDivisaoSugerida,
    String statusMatricula,
    LocalDate dataVencimentoMatricula,
    ProximaFaturaDTO proximaFatura
) {}

public record ProximaFaturaDTO(
    Long id,
    BigDecimal valor,
    LocalDate dataVencimento,
    String status
) {}
```

---

## 2. Estratégia de Consultas Otimizadas

As consultas de agregação utilizam projeções SQL diretas com contagens condicionais para evitar carregar entidades completas na memória da JVM:

```sql
-- Exemplo de query otimizada para o Dashboard Admin:
SELECT 
    COUNT(CASE WHEN a.status = 'ATIVO' THEN 1 END) AS ativos,
    COUNT(CASE WHEN a.status = 'INATIVO' THEN 1 END) AS inativos,
    COUNT(CASE WHEN a.status = 'TRANCADO' THEN 1 END) AS trancados
FROM tb_aluno a;
```

---

## 3. Componentes Frontend (Angular 22)

1. `DashboardContainerComponent`: Componente raiz roteado em `/dashboard` que inspeciona o perfil do usuário logado através do `AuthService.currentUser()` e renderiza o subcomponente especializado:
   - `<app-dashboard-admin />`
   - `<app-dashboard-recepcao />`
   - `<app-dashboard-instrutor />`
   - `<app-dashboard-aluno />`
2. `KpiCardComponent`: Componente reutilizável para exibição de métricas com ícone, título, valor grande em destaque e variação percentual.
3. `HorarioChartComponent`: Mini gráfico SVG responsivo nativo ilustrando o fluxo da academia por hora (pico de manhã e início da noite).
