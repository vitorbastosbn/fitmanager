import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-primeiro-acesso-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Primeiro Acesso</h3>
            <p class="text-xs text-slate-400">Redefina sua senha inicial para continuar</p>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Nova Senha</label>
            <input
              type="password"
              formControlName="novaSenha"
              placeholder="Mínimo de 6 caracteres"
              class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Confirmação da Nova Senha</label>
            <input
              type="password"
              formControlName="confirmacaoNovaSenha"
              placeholder="Repita a nova senha"
              class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-semibold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 mt-2"
          >
            @if (loading()) {
              <span class="inline-block animate-spin w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full"></span>
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
