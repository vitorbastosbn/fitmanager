# Design Técnico: Experiência Mobile & Responsividade (Mobile)

## 1. Arquitetura de Interface e Componentes

### 1.1 Bottom Navigation Bar (`BottomNavComponent`)

No ecossistema Angular 22 standalone, a barra inferior será implementada como um componente autocontido (`app-bottom-nav`) injetado no layout principal da aplicação (`app.component.html`), visível exclusivamente em viewports móveis (`md:hidden`).

```mermaid
graph TD
    App[AppComponent] --> TopNav[TopNavComponent (Hidden on < 768px)]
    App --> MainContent[RouterOutlet (Com padding-bottom 80px no mobile)]
    App --> BottomNav[BottomNavComponent (Visível apenas em < 768px)]
    BottomNav --> AuthService[AuthService (Obtém Role Atual)]
    BottomNav --> MobileLinks[Links contextuais por Perfil]
```

### 1.2 Layout Responsivo e Thumb Zone

- **Posicionamento**: `fixed bottom-0 left-0 right-0 z-50 md:hidden`
- **Safe Area Insets**: Suporte nativo ao entalhe e barra de gestos do iOS com CSS `env(safe-area-inset-bottom, 0px)`.
- **Efeito Visual**: Glassmorphism (`backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800`).
- **Dimensões Mínimas**: Área de toque de cada item de navegação com altura mínima de `56px` e largura mínima de `48px`.

### 1.3 Mapeamento de Atalhos por Perfil

| Perfil | Atalho 1 | Atalho 2 | Atalho 3 (Central/Destaque) | Atalho 4 | Atalho 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ROLE_ALUNO** | Início (`/dashboard`) | Treino (`/treinos`) | **QR Code (`/frequencia`)** | Faturas (`/financeiro`) | Planos (`/planos`) |
| **ROLE_INSTRUTOR** | Início (`/dashboard`) | Alunos (`/alunos`) | **Prescrever Treino (`/treinos`)** | Frequência (`/frequencia`) | Perfil |
| **ROLE_RECEPCIONISTA** | Início (`/dashboard`) | **Catraca (`/frequencia`)** | Alunos (`/alunos`) | Mensalidades (`/financeiro`) | Planos (`/planos`) |
| **ROLE_ADMIN** | Início (`/dashboard`) | Equipe (`/colaboradores`) | Alunos (`/alunos`) | Financeiro (`/financeiro`) | Frequência (`/frequencia`) |

---

## 2. Padrões de Interação Touch e Teclados Virtuais

### 2.1 Teclados Nativos via `inputmode`

Para agilizar o uso durante a prática de exercícios e evitar que o usuário precise alternar teclados no smartphone:

- Cargas / Pesos (kg): `<input type="text" inputmode="decimal" pattern="[0-9]*[.,]?[0-9]*" ... />`
- Repetições e Séries: `<input type="number" inputmode="numeric" pattern="[0-9]*" ... />`
- CPF / Telefones / CEP: `<input type="text" inputmode="numeric" ... />`

### 2.2 Remoção de Atraso de Toque (*Double-tap zoom delay*)

Aplicação da regra global no `styles.css`:

```css
button, a, input, select, textarea, [role="button"] {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
```

### 2.3 Transformação de Tabelas em Cartões Móveis

Tabelas extensas (como faturas, histórico de check-ins e lista de alunos) recebem layout adaptativo:
- Desktop (`>= 768px`): `<table>` tradicional completa.
- Mobile (`< 768px`): Cartões verticais contendo as informações prioritárias em lista condensada, com botão de detalhes em modal.

---

## 3. Especificação do Componente `BottomNavComponent`

```typescript
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-lg">
      <div class="flex items-center justify-around h-16 px-2">
        <a *ngFor="let item of navItems()" 
           [routerLink]="item.route" 
           routerLinkActive="text-primary-600 dark:text-primary-400 font-bold"
           [routerLinkActiveOptions]="{ exact: item.exact }"
           class="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-150">
          <span class="text-xl mb-0.5">{{ item.icon }}</span>
          <span class="text-[10px] tracking-tight">{{ item.label }}</span>
        </a>
      </div>
    </nav>
  `
})
export class BottomNavComponent {
  // Configurações reativas baseadas em AuthService.currentUser()
}
```
