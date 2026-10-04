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
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in relative">
          <!-- Header -->
          <div class="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              ⚖️
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight">{{ termo()!.titulo }}</h2>
              <span class="text-xs text-amber-400 font-mono font-semibold">Versão Regulamentar: {{ termo()!.versao }}</span>
            </div>
          </div>

          <!-- Conteúdo com Scroll -->
          <div class="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 max-h-64 overflow-y-auto text-xs leading-relaxed text-slate-300 space-y-3 font-sans">
            <p>{{ termo()!.conteudo }}</p>
            <p class="text-slate-400 pt-2 border-t border-slate-800/60">
              <strong>Direitos do Titular (Art. 18):</strong> Você possui o direito de confirmar a existência de tratamento, acessar seus dados, solicitar a portabilidade em arquivo estruturado, e revogar o consentimento ou exigir anonimização cadastral, observados os prazos de guarda fiscal de 5 anos preconizados pelo Art. 173 do Código Tributário Nacional.
            </p>
          </div>

          <!-- Checkbox de Concordância -->
          <label class="flex items-start space-x-3 cursor-pointer group pt-1">
            <input
              type="checkbox"
              [(ngModel)]="aceiteChecked"
              class="mt-0.5 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 w-4 h-4 cursor-pointer"
            />
            <span class="text-xs text-slate-300 group-hover:text-white transition-colors">
              Declaro que li e concordo expressamente com os Termos de Uso e Política de Privacidade de Dados Pessoais do FitManager.
            </span>
          </label>

          @if (errorMessage()) {
            <div class="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
              {{ errorMessage() }}
            </div>
          }

          <!-- Botão de Aceite -->
          <div class="flex justify-end pt-3 border-t border-slate-800">
            <button
              type="button"
              (click)="confirmarAceite()"
              [disabled]="!aceiteChecked || salvando()"
              class="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              @if (salvando()) {
                <svg class="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
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
