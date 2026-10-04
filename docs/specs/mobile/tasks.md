# Tarefas de Implementação: Experiência Mobile & Responsividade (Mobile)

## Fase 1: Componente Bottom Navigation
- [ ] Criar componente standalone `BottomNavComponent` (`bottom-nav.component.ts`) com templates reativos baseados no perfil do usuário logado (`AuthService.currentUser()`).
- [ ] Integrar `BottomNavComponent` no layout raiz `AppComponent`.
- [ ] Ajustar espaçamento inferior (`padding-bottom: 80px`) no container do `router-outlet` em telas `< 768px` para evitar sobreposição de conteúdo com a barra fixa.

## Fase 2: Otimizações de Toque e Viewport
- [ ] Adicionar estilos de acessibilidade ao toque no `styles.css` (`touch-action: manipulation` e `-webkit-tap-highlight-color: transparent`).
- [ ] Garantir hitboxes mínimas de 44x44px em todos os botões de ação e ícones de paginação/fechamento.
- [ ] Atualizar inputs numéricos de séries, repetições e cargas com `inputmode="decimal"` ou `inputmode="numeric"`.
- [ ] Otimizar modal e exibição do QR Code de check-in para ocupar a área central do viewport sem exigir rolagem na tela do smartphone.

## Fase 3: Responsividade de Tabelas e Listagens
- [ ] Ajustar tabelas de alunos, cobranças e treinos para suportar rolagem horizontal suave (`overflow-x-auto`) ou exibição em formato de cards em telas estreitas.
- [ ] Testar formulários em resoluções de 375px (iPhone SE/iPhone 13 mini) garantindo que nenhum input sofra overflow lateral.

## Fase 4: Validação E2E com Emulação Mobile
- [ ] Adicionar cenários de teste no Playwright emulando viewports mobile (ex: `viewport: { width: 375, height: 667 }`).
- [ ] Validar visibilidade e navegação da `BottomNavComponent` nos perfis `ROLE_ALUNO`, `ROLE_INSTRUTOR`, `ROLE_RECEPCIONISTA` e `ROLE_ADMIN`.
