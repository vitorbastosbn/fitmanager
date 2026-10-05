import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PrimeiroAcessoModalComponent } from './features/auth/primeiro-acesso-modal.component';
import { BottomNavComponent } from './core/components/bottom-nav.component';
import { ConsentimentoModalComponent } from './features/lgpd/consentimento-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PrimeiroAcessoModalComponent, BottomNavComponent, ConsentimentoModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  readonly openDropdown = signal<string | null>(null);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.openDropdown.set(null);
      }
    });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openDropdown.set(null);
  }

  toggleDropdown(menu: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdown.update((current) => (current === menu ? null : menu));
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
  }

  isAuthPage(): boolean {
    return this.router.url.includes('/login');
  }

  getUserInitials(nome?: string): string {
    if (!nome) return 'FM';
    const parts = nome.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  formatarPerfil(perfil?: string): string {
    if (!perfil) return '';
    const roles: Record<string, string> = {
      ROLE_ADMIN: 'Administrador',
      ROLE_INSTRUTOR: 'Instrutor',
      ROLE_RECEPCIONISTA: 'Recepção',
      ROLE_ALUNO: 'Aluno'
    };
    return roles[perfil] || perfil;
  }

  getRoleBadgeClass(perfil?: string): string {
    switch (perfil) {
      case 'ROLE_ADMIN':
        return 'bg-amber-400/10 text-amber-400 border-amber-400/30';
      case 'ROLE_INSTRUTOR':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30';
      case 'ROLE_ALUNO':
        return 'bg-sky-400/10 text-sky-400 border-sky-400/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
