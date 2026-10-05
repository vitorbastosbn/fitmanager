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
      <div class="text-center max-w-xl mx-auto border-b border-slate-200 pb-4">
        <span class="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">Planos e Assinaturas</span>
        <h2 class="text-xl font-bold text-slate-900 tracking-tight mt-0.5">Mensalidades e Pacotes</h2>
        <p class="text-xs text-slate-500 mt-1">Selecione o plano ideal para suas metas de treino e condicionamento</p>
      </div>

      @if (sucessoMensagem()) {
        <div class="max-w-xl mx-auto p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-800 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ sucessoMensagem() }}</span>
          </div>
          <button (click)="sucessoMensagem.set(null)" class="text-emerald-700 hover:text-emerald-900 font-bold p-1">&times;</button>
        </div>
      }

      @if (loading()) {
        <div class="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <div class="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs">Carregando planos disponíveis...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          @for (plano of planos(); track plano.id) {
            <div
              class="bg-white border rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all relative shadow-xs hover:border-slate-300"
              [ngClass]="plano.periodicidade === 'TRIMESTRAL' ? 'border-slate-900 shadow-sm ring-1 ring-slate-900' : 'border-slate-200'"
            >
              @if (plano.periodicidade === 'TRIMESTRAL') {
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider rounded-full shadow-2xs">
                  Mais Popular
                </div>
              }

              <div>
                <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {{ plano.periodicidade }}
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-1">{{ plano.nome }}</h3>
                <p class="text-xs text-slate-500 min-h-[40px] leading-relaxed">{{ plano.descricao }}</p>

                <div class="mt-4 mb-5 pb-4 border-b border-slate-100 flex items-baseline gap-1">
                  <span class="text-xs text-slate-400 font-medium">R$</span>
                  <span class="text-3xl font-extrabold text-slate-900 tracking-tight">{{ plano.valorMensalidade | number:'1.2-2' }}</span>
                  <span class="text-xs text-slate-500">/mês</span>
                </div>

                <ul class="space-y-2.5 text-xs text-slate-600 mb-6">
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Acesso total à sala de musculação</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Ficha de treino digital no app</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Check-in instantâneo via QR Code</span>
                  </li>
                </ul>
              </div>

              @if (modoSelecao) {
                <button
                  (click)="iniciarMatricula(plano)"
                  class="w-full py-2.5 px-4 rounded-md text-xs font-medium transition-colors flex items-center justify-center min-h-[40px]"
                  [ngClass]="plano.periodicidade === 'TRIMESTRAL'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'"
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
