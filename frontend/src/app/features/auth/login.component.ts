import { Component, OnInit, inject, signal } from '@angular/core';
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
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-8 shadow-xs relative">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-white mb-3 shadow-xs">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-slate-900 tracking-tight">FitManager</h1>
          <p class="text-xs text-slate-500 mt-0.5">Acesso ao Painel Administrativo e Operacional</p>
        </div>

        @if (errorMessage()) {
          <div class="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
            <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">E-mail corporativo</label>
            <input
              type="email"
              formControlName="email"
              placeholder="nome@academia.com"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-slate-700">Senha</label>
            </div>
            <input
              type="password"
              formControlName="senha"
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors shadow-2xs"
            />
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || loading()"
            class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 shadow-xs mt-2"
          >
            @if (loading()) {
              <span class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Autenticando...</span>
            } @else {
              <span>Entrar no Sistema</span>
            }
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
          Autenticação criptografada com controle de acessos por perfil.
        </div>
      </div>

      <!-- Modal de Primeiro Acesso Obrigatório -->
      @if (showFirstAccessModal()) {
        <app-primeiro-acesso-modal (senhaAlterada)="onPasswordChanged()" />
      }
    </div>
  `
})
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirecionarPorPerfil(this.authService.currentUser()?.perfil);
    }
  }

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
    this.router.navigate(['/dashboard']);
  }
}
