import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  destaque?: boolean;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (authService.isAuthenticated()) {
      <nav class="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-2xl pb-[env(safe-area-inset-bottom,0px)]">
        <div class="flex items-center justify-around h-16 px-1">
          @for (item of getNavItems(); track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="text-amber-400 font-bold"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              class="flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] text-slate-400 hover:text-white transition-colors group relative"
            >
              @if (item.destaque) {
                <div class="w-10 h-10 -mt-5 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform text-lg">
                  {{ item.icon }}
                </div>
                <span class="text-[10px] tracking-tight mt-0.5 font-bold text-amber-400">{{ item.label }}</span>
              } @else {
                <span class="text-lg leading-none mb-1">{{ item.icon }}</span>
                <span class="text-[10px] tracking-tight leading-tight">{{ item.label }}</span>
              }
            </a>
          }
        </div>
      </nav>
    }
  `
})
export class BottomNavComponent {
  readonly authService = inject(AuthService);

  getNavItems(): NavItem[] {
    const perfil = this.authService.currentUser()?.perfil;

    if (perfil === 'ROLE_ALUNO') {
      return [
        { label: 'Início', route: '/dashboard', icon: '🏠' },
        { label: 'Treino', route: '/treinos/me', icon: '🏋️' },
        { label: 'QR Code', route: '/frequencia/meu-qrcode', icon: '📱', destaque: true },
        { label: 'Faturas', route: '/financeiro', icon: '💳' }
      ];
    }

    if (perfil === 'ROLE_INSTRUTOR') {
      return [
        { label: 'Início', route: '/dashboard', icon: '🏠' },
        { label: 'Prescrever', route: '/treinos/prescrever', icon: '📋', destaque: true },
        { label: 'Catálogo', route: '/treinos/exercicios', icon: '💪' },
        { label: 'Alunos', route: '/alunos', icon: '👥' }
      ];
    }

    if (perfil === 'ROLE_RECEPCIONISTA') {
      return [
        { label: 'Início', route: '/dashboard', icon: '🏠' },
        { label: 'Catraca', route: '/frequencia/terminal', icon: '⚡', destaque: true },
        { label: 'Alunos', route: '/alunos', icon: '👥' },
        { label: 'Financeiro', route: '/financeiro', icon: '💵' }
      ];
    }

    // ROLE_ADMIN
    return [
      { label: 'Início', route: '/dashboard', icon: '🏠' },
      { label: 'Equipe', route: '/colaboradores', icon: '👔' },
      { label: 'Terminal', route: '/frequencia/terminal', icon: '⚡', destaque: true },
      { label: 'Alunos', route: '/alunos', icon: '👥' },
      { label: 'Financeiro', route: '/financeiro', icon: '💵' }
    ];
  }
}
