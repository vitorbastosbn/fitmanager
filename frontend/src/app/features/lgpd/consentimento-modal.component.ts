import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LgpdService } from '../../core/services/lgpd.service';
import { AuthService } from '../../core/services/auth.service';
import { TermoVigente } from '../../core/models/lgpd.models';

@Component({
  selector: 'app-consentimento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (exibirModal() && termo()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div class="bg-white border border-slate-200 rounded-xl w-full max-w-2xl p-6 shadow-xl space-y-4 animate-fade-in relative">
          <!-- Header -->
          <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">{{ termo()!.titulo }}</h2>
              <span class="text-[11px] text-slate-500 font-mono">Versão Regulamentar: {{ termo()!.versao }}</span>
            </div>
          </div>

          <!-- Conteúdo com Scroll -->
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto text-xs leading-relaxed text-slate-600 space-y-3 font-sans">
            <p>{{ termo()!.conteudo }}</p>
            <p class="text-slate-500 pt-2 border-t border-slate-200">
              <strong class="text-slate-700">Direitos do Titular (Art. 18):</strong> Você possui o direito de confirmar a existência de tratamento, acessar seus dados, solicitar a portabilidade em arquivo estruturado, e revogar o consentimento ou exigir anonimização cadastral, observados os prazos de guarda fiscal de 5 anos preconizados pelo Art. 173 do Código Tributário Nacional.
            </p>
          </div>

          <!-- Checkbox de Concordância -->
          <label class="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              [(ngModel)]="aceiteChecked"
              class="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4 cursor-pointer"
            />
            <span class="text-xs text-slate-700 leading-normal">
              Declaro que li e concordo expressamente com os Termos de Uso e Política de Privacidade de Dados Pessoais do FitManager.
            </span>
          </label>

          @if (errorMessage()) {
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Botão de Aceite -->
          <div class="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              (click)="confirmarAceite()"
              [disabled]="!aceiteChecked || salvando()"
              class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-md text-xs transition-colors shadow-xs flex items-center gap-2 min-h-[38px]"
            >
              @if (salvando()) {
                <svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registrando...</span>
              } @else {
                <span>Concordar e Continuar</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConsentimentoModalComponent implements OnInit {
  private readonly lgpdService = inject(LgpdService);
  private readonly authService = inject(AuthService);

  termo = signal<TermoVigente | null>(null);
  exibirModal = signal(false);
  aceiteChecked = false;
  salvando = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.verificarConsentimento();
    }
  }

  verificarConsentimento(): void {
    this.lgpdService.obterTermoVigente().subscribe({
      next: (t) => {
        this.termo.set(t);
        if (!t.jaAceito && t.obrigatorio) {
          this.exibirModal.set(true);
        }
      },
      error: () => {}
    });
  }

  confirmarAceite(): void {
    if (!this.termo()) return;
    this.salvando.set(true);
    this.errorMessage.set(null);

    this.lgpdService.registrarAceite(this.termo()!.id).subscribe({
      next: () => {
        this.salvando.set(false);
        this.exibirModal.set(false);
      },
      error: (err) => {
        this.salvando.set(false);
        this.errorMessage.set(err.error?.detail || err.error?.message || 'Falha ao registrar consentimento.');
      }
    });
  }
}
