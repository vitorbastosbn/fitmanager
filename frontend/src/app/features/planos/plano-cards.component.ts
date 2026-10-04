import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plano, Matricula } from '../../core/models/plano.models';
import { PlanoService } from '../../core/services/plano.service';
import { MatriculaModalComponent } from './matricula-modal.component';

@Component({
  selector: 'app-plano-cards',
  standalone: true,
  imports: [CommonModule, MatriculaModalComponent],
  template: `
    <div class="space-y-6">
      <div class="text-center max-w-xl mx-auto">
        <h2 class="text-2xl font-black text-white tracking-tight">Planos e Mensalidades</h2>
        <p class="text-sm text-slate-400 mt-1">Selecione o plano ideal para suas metas de treino e condicionamento</p>
      </div>

      @if (sucessoMensagem()) {
        <div class="max-w-xl mx-auto p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-sm font-semibold text-emerald-400 flex items-center justify-between">
          <span>{{ sucessoMensagem() }}</span>
          <button (click)="sucessoMensagem.set(null)" class="text-emerald-400 hover:text-white">&times;</button>
        </div>
      }

      @if (loading()) {
        <div class="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm">Carregando planos disponíveis...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          @for (plano of planos(); track plano.id) {
            <div
              class="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-2xl hover:shadow-emerald-500/10"
              [ngClass]="{ 'border-emerald-500 ring-1 ring-emerald-500 bg-slate-900/90': plano.periodicidade === 'TRIMESTRAL' }"
            >
              @if (plano.periodicidade === 'TRIMESTRAL') {
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow">
                  Mais Popular
                </div>
              }

              <div>
                <div class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  {{ plano.periodicidade }}
                </div>
                <h3 class="text-xl font-black text-white mb-2">{{ plano.nome }}</h3>
                <p class="text-xs text-slate-400 min-h-[48px]">{{ plano.descricao }}</p>

                <div class="mt-6 mb-6 pb-6 border-b border-slate-800 flex items-baseline space-x-1">
                  <span class="text-xs text-slate-400 font-medium">R$</span>
                  <span class="text-4xl font-extrabold text-white tracking-tight">{{ plano.valorMensalidade | number:'1.2-2' }}</span>
                  <span class="text-xs text-slate-400">/mês</span>
                </div>

                <ul class="space-y-3 text-xs text-slate-300 mb-8">
                  <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Acesso total à sala de musculação</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ficha de treino digital no app</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Check-in instantâneo via QR Code</span>
                  </li>
                </ul>
              </div>

              @if (modoSelecao) {
                <button
                  (click)="iniciarMatricula(plano)"
                  class="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  [ngClass]="plano.periodicidade === 'TRIMESTRAL' ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 hover:bg-slate-700 text-white'"
                >
                  <span>Contratar este Plano</span>
                </button>
              }
            </div>
          }
        </div>
      }

      @if (planoParaMatricula()) {
        <app-matricula-modal
          [plano]="planoParaMatricula()!"
          (concluido)="onMatriculado()"
          (cancelar)="planoParaMatricula.set(null)"
        />
      }
    </div>
  `
})
export class PlanoCardsComponent implements OnInit {
  private readonly planoService = inject(PlanoService);

  @Input() modoSelecao = true;
  @Output() selecionarPlano = new EventEmitter<Plano>();

  readonly planos = signal<Plano[]>([]);
  readonly loading = signal(false);
  readonly planoParaMatricula = signal<Plano | null>(null);
  readonly sucessoMensagem = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarPlanos();
  }

  iniciarMatricula(plano: Plano): void {
    this.planoParaMatricula.set(plano);
    this.selecionarPlano.emit(plano);
  }

  onMatriculado(): void {
    const plano = this.planoParaMatricula();
    this.planoParaMatricula.set(null);
    this.sucessoMensagem.set(`Matrícula no ${plano?.nome || 'plano'} efetivada com sucesso!`);
    setTimeout(() => this.sucessoMensagem.set(null), 5000);
  }

  carregarPlanos(): void {
    this.loading.set(true);
    this.planoService.listar(true).subscribe({
      next: (planos) => {
        this.planos.set(planos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
