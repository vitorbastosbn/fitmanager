import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-primeiro-acesso-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-xl relative">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Primeiro Acesso Obrigatório</h3>
            <p class="text-xs text-slate-500">Defina uma nova senha corporativa para prosseguir</p>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Nova Senha</label>
            <input
              type="password"
              formControlName="novaSenha"
              placeholder="Mínimo de 6 caracteres"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Confirmação da Nova Senha</label>
            <input
              type="password"
              formControlName="confirmacaoNovaSenha"
              placeholder="Repita a nova senha"
              class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-all flex items-center justify-center space-x-2 mt-2 shadow-xs"
          >
            @if (loading()) {
              <span class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Salvando...</span>
            } @else {
              <span>Definir Nova Senha e Acessar</span>
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class PrimeiroAcessoModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  @Output() senhaAlterada = new EventEmitter<void>();

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmacaoNovaSenha: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const { novaSenha, confirmacaoNovaSenha } = this.form.value;
    if (novaSenha !== confirmacaoNovaSenha) {
      this.errorMessage.set('As senhas não coincidem.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.alterarSenhaPrimeiroAcesso({
      novaSenha: novaSenha!,
      confirmacaoNovaSenha: confirmacaoNovaSenha!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.senhaAlterada.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.detail || 'Erro ao alterar senha.');
      }
    });
  }
}
