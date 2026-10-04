# Especificação de Domínio: Experiência Mobile & Responsividade (Mobile)

## 1. Visão Geral e Escopo
A especificação de **Mobile & Responsividade** estabelece padrões de interface e experiência voltados a smartphones e dispositivos móveis. Em academias, a maior parte dos alunos utiliza o sistema em smartphones (para check-in na catraca e acompanhamento das séries durante o treino), enquanto instrutores e recepcionistas frequentemente utilizam tablets ou notebooks.

---

## 2. Requisitos em Notação EARS

### Requisitos Funcionais

- **[EARS-MOB-001] (State-driven)**: **ENQUANTO** a aplicação for visualizada em telas com largura inferior a 768px (smartphones e pequenos tablets), **O SISTEMA DEVE** ocultar a barra de navegação superior tradicional e ativar a **Bottom Navigation Bar** (barra inferior fixa) posicionada dentro da zona ergonômica do polegar (*thumb zone*).
- **[EARS-MOB-002] (State-driven)**: **ENQUANTO** a Bottom Navigation Bar estiver ativa, **O SISTEMA DEVE** exibir os 4 ou 5 atalhos mais relevantes para o perfil do usuário logado (ex para Aluno: Início, Treino, QR Code, Faturas, Perfil).
- **[EARS-MOB-003] (Event-driven)**: **QUANDO** o aluno abrir a tela de visualização de treino no smartphone, **O SISTEMA DEVE** apresentar cada exercício em cartões individuais verticais, com botões de incremento/decremento de carga e repetições otimizados para toque.
- **[EARS-MOB-004] (Event-driven)**: **QUANDO** o aluno abrir o QR Code de acesso, **O SISTEMA DEVE** ocupar a área central da tela com contraste máximo e manter a contagem regressiva de 60s visível e sem necessidade de rolagem.
- **[EARS-MOB-005] (Ubiquitous)**: **O SISTEMA DEVE** garantir que todos os elementos interativos (botões, links, inputs, seletores) possuam uma área de toque mínima de 44x44 pixels para prevenir toques acidentais durante a atividade física.

### Requisitos Não Funcionais

- **[RNF-MOB-001]**: Responsividade fluida sem scroll horizontal em resoluções a partir de 320px de largura (ex: iPhone SE) até telas maiores (iPhone Pro Max, tablets).
- **[RNF-MOB-002]**: Uso de atributos `inputmode="decimal"` e `inputmode="numeric"` para acionar automaticamente o teclado numérico nativo em dispositivos iOS e Android ao editar repetições e cargas.
- **[RNF-MOB-003]**: Tempo de resposta tátil imediato (remoção de delay de 300ms com `touch-action: manipulation`).

---

## 3. Critérios de Aceite (Gherkin)

```gherkin
Cenário: Aluno acessa sistema em viewport de smartphone
  Dado que o aluno acessa o FitManager em um dispositivo com largura de 375px
  Quando a aplicação carregar
  Então a barra de navegação superior horizontal é ocultada
  E a barra de navegação inferior (Bottom Navigation Bar) é fixada no rodapé
  E os botões de navegação possuem altura mínima de 48px

Cenário: Entrada de carga de treino no mobile
  Dado que o aluno está registrando o peso no exercício Supino Reto
  Quando ele tocar no campo de carga
  Então o teclado virtual do dispositivo abre no modo numérico/decimal
```
