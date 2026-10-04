import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PrimeiroAcessoModalComponent } from './features/auth/primeiro-acesso-modal.component';
import { BottomNavComponent } from './core/components/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PrimeiroAcessoModalComponent, BottomNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
}
