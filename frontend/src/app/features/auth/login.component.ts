import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PrimeiroAcessoModalComponent } from './primeiro-acesso-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeiroAcessoModalComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <!-- Glow decorativo -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-inner">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">FitManager</h1>
          <p class="text-sm text-slate-400 mt-1">Sistema Integrado de Gestão de Academia</p>
        </div>

        @if (errorMessage()) {
          <div class="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center space-x-2">
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">E-mail de Acesso</label>
            <input
              type="email"
              formControlName="email"
              placeholder="seu.email@academia.com"
              class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5">Senha</label>
            <input
              type="password"
              formControlName="senha"
              placeholder="••••••••"
              class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || loading()"
            class="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 mt-2"
          >
            @if (loading()) {
              <span class="inline-block animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"></span>
              <span>Autenticando...</span>
            } @else {
              <span>Entrar no Sistema</span>
            }
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          Acesso seguro com criptografia de ponta a ponta e controle de perfis.
        </div>
      </div>

      <!-- Modal de Primeiro Acesso Obrigatório -->
      @if (showFirstAccessModal()) {
        <app-primeiro-acesso-modal (senhaAlterada)="onPasswordChanged()" />
      }
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showFirstAccessModal = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, senha } = this.loginForm.value;

    this.authService.login({ email: email!, senha: senha! }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.usuario.primeiroAcesso) {
          this.showFirstAccessModal.set(true);
        } else {
          this.redirecionarPorPerfil(response.usuario.perfil);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.detail || 'Falha ao autenticar. Verifique suas credenciais.');
      }
    });
  }

  onPasswordChanged(): void {
    this.showFirstAccessModal.set(false);
    const user = this.authService.currentUser();
    this.redirecionarPorPerfil(user?.perfil);
  }

  private redirecionarPorPerfil(perfil?: string): void {
    if (perfil === 'ROLE_ALUNO') {
      this.router.navigate(['/treinos/me']);
    } else if (perfil === 'ROLE_INSTRUTOR') {
      this.router.navigate(['/treinos/prescrever']);
    } else {
      this.router.navigate(['/alunos']);
    }
  }
}
