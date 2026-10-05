import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  iconType: 'home' | 'workout' | 'qrcode' | 'invoice' | 'privacy' | 'prescribe' | 'catalog' | 'users' | 'terminal' | 'finance' | 'team';
  destaque?: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (authService.isAuthenticated()) {
      <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-sm pb-[env(safe-area-inset-bottom,0px)]">
        <div class="flex items-center justify-around h-16 px-1">
          @for (item of getNavItems(); track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="text-slate-900 font-semibold"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              class="flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] text-slate-500 hover:text-slate-900 transition-colors group relative"
            >
              @if (item.destaque) {
                <div class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
                  <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: item.iconType, size: 'w-4 h-4' }"></ng-container>
                </div>
                <span class="text-[10px] tracking-tight mt-1 font-semibold text-slate-900">{{ item.label }}</span>
              } @else {
                <div class="w-5 h-5 mb-0.5 flex items-center justify-center">
                  <ng-container *ngTemplateOutlet="iconTpl; context: { $implicit: item.iconType, size: 'w-5 h-5' }"></ng-container>
                </div>
                <span class="text-[10px] tracking-tight leading-tight">{{ item.label }}</span>
              }
            </a>
          }
        </div>
      </nav>

      <!-- SVG Icon Template Definitions -->
      <ng-template #iconTpl let-type let-size="size">
        @switch (type) {
          @case ('home') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
          @case ('workout') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-10.5m-7.5 12l4.5-4.5m3-3l4.5-4.5M6 18l1.5-1.5m10.5-7.5L19.5 7.5M4.5 19.5l1.5-1.5m12-12l1.5-1.5" />
            </svg>
          }
          @case ('qrcode') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM16.5 13.5h.008v.008h-.008v-.008zM19.5 13.5h.008v.008h-.008v-.008zM13.5 16.5h.008v.008h-.008v-.008zM16.5 16.5h.008v.008h-.008v-.008zM19.5 16.5h.008v.008h-.008v-.008zM13.5 19.5h.008v.008h-.008v-.008zM16.5 19.5h.008v.008h-.008v-.008zM19.5 19.5h.008v.008h-.008v-.008z" />
            </svg>
          }
          @case ('invoice') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          }
          @case ('privacy') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          }
          @case ('prescribe') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          @case ('catalog') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          }
          @case ('users') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
          @case ('terminal') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          }
          @case ('finance') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          @case ('team') {
            <svg [class]="size" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          }
        }
      </ng-template>
    }
  `
})
export class BottomNavComponent {
  readonly authService = inject(AuthService);

  getNavItems(): NavItem[] {
    const perfil = this.authService.currentUser()?.perfil;

    if (perfil === 'ROLE_ALUNO') {
      return [
        { label: 'Início', route: '/dashboard', iconType: 'home' },
        { label: 'Treino', route: '/treinos/me', iconType: 'workout' },
        { label: 'QR Code', route: '/frequencia/meu-qrcode', iconType: 'qrcode', destaque: true },
        { label: 'Faturas', route: '/financeiro', iconType: 'invoice' },
        { label: 'Privacidade', route: '/privacidade', iconType: 'privacy' }
      ];
    }

    if (perfil === 'ROLE_INSTRUTOR') {
      return [
        { label: 'Início', route: '/dashboard', iconType: 'home' },
        { label: 'Prescrever', route: '/treinos/prescrever', iconType: 'prescribe', destaque: true },
        { label: 'Catálogo', route: '/treinos/exercicios', iconType: 'catalog' },
        { label: 'Alunos', route: '/alunos', iconType: 'users' }
      ];
    }

    if (perfil === 'ROLE_RECEPCIONISTA') {
      return [
        { label: 'Início', route: '/dashboard', iconType: 'home' },
        { label: 'Catraca', route: '/frequencia/terminal', iconType: 'terminal', destaque: true },
        { label: 'Alunos', route: '/alunos', iconType: 'users' },
        { label: 'Financeiro', route: '/financeiro', iconType: 'finance' }
      ];
    }

    // ROLE_ADMIN
    return [
      { label: 'Início', route: '/dashboard', iconType: 'home' },
      { label: 'Equipe', route: '/colaboradores', iconType: 'team' },
      { label: 'Terminal', route: '/frequencia/terminal', iconType: 'terminal', destaque: true },
      { label: 'Alunos', route: '/alunos', iconType: 'users' },
      { label: 'Financeiro', route: '/financeiro', iconType: 'finance' }
    ];
  }
}

