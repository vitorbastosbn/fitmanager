import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreinoService } from '../../core/services/treino.service';
import { DivisaoTreino, ItemDivisao, RegistrarExecucaoRequest } from '../../core/models/treino.models';

@Component({
  selector: 'app-ficha-visualizacao-mobile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-lg mx-auto p-4 space-y-5">
      <!-- Header -->
      <div class="border-b border-slate-200 pb-3">
        <span class="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">Treinamento</span>
        <h2 class="text-xl font-bold text-slate-900 tracking-tight mt-0.5">Ficha de Treino Vigente</h2>
        @if (ficha()) {
          <div class="flex items-center gap-2 mt-1 text-xs text-slate-600 flex-wrap">
            <span class="font-medium text-slate-900">{{ ficha()!.objetivo }}</span>
            <span>&bull;</span>
            <span>Instrutor: {{ ficha()!.instrutorNome }}</span>
          </div>
        }
      </div>

      @if (sucessoFeedback()) {
        <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-medium">{{ sucessoFeedback() }}</span>
          </div>
          <button (click)="sucessoFeedback.set(null)" class="text-emerald-700 hover:text-emerald-900 font-bold p-1">&times;</button>
        </div>
      }

      @if (ficha()) {
        <!-- Division Tabs (A, B, C...) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          @for (div of ficha()!.divisoes; track div.id; let idx = $index) {
            <button
              (click)="selecionarDivisao(div)"
              [class]="divisaoAtiva()?.id === div.id
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'"
              class="px-4 py-2.5 rounded-lg text-xs whitespace-nowrap transition-colors flex items-center gap-2 min-h-[44px]"
            >
              <span [class]="divisaoAtiva()?.id === div.id ? 'bg-slate-800 text-slate-100' : 'bg-slate-100 text-slate-700'"
                    class="w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold">
                {{ div.letra }}
              </span>
              <span>{{ div.nome }}</span>
            </button>
          }
        </div>

        <!-- Exercises List in Active Division -->
        @if (divisaoAtiva()) {
          <div class="space-y-3">
            @for (item of divisaoAtiva()!.itens; track item.id; let itemIdx = $index) {
              <div class="rounded-xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-mono font-bold text-slate-400">#{{ item.ordemExecucao }}</span>
                      <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {{ item.grupoMuscular }}
                      </span>
                    </div>
                    <h3 class="text-base font-bold text-slate-900 leading-tight mt-1">{{ item.exercicioNome }}</h3>
                  </div>
                </div>

                <!-- Prescribed Metrics Chips -->
                <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Séries & Reps</span>
                    <span class="text-xs font-bold text-slate-900">{{ item.series }} &times; {{ item.repeticoes }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Carga Alvo</span>
                    <span class="text-xs font-bold text-slate-900">{{ item.cargaKg }} kg</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Descanso</span>
                    <span class="text-xs font-bold text-slate-900">{{ item.descansoSegundos }}s</span>
                  </div>
                </div>

                @if (item.observacoes) {
                  <p class="text-xs text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-200/60 text-slate-500">
                    <span class="font-semibold text-slate-700">Obs:</span> {{ item.observacoes }}
                  </p>
                }

                <!-- Action to register execution -->
                <div class="pt-1">
                  @if (itemEmEdicao()?.id === item.id) {
                    <!-- Inline Execution Form -->
                    <div class="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-3">
                      <span class="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                        Registrar Execução de Hoje
                      </span>

                      <div class="grid grid-cols-2 gap-2.5">
                        <div>
                          <label class="block text-[10px] uppercase text-slate-500 font-bold mb-1">Carga Real (kg)</label>
                          <input
                            type="number"
                            inputmode="decimal"
                            step="0.5"
                            [(ngModel)]="execucaoCarga"
                            class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 font-mono text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 min-h-[44px] shadow-2xs"
                          />
                        </div>
                        <div>
                          <label class="block text-[10px] uppercase text-slate-500 font-bold mb-1">Reps Realizadas</label>
                          <input
                            type="number"
                            inputmode="numeric"
                            [(ngModel)]="execucaoReps"
                            class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 font-mono text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 min-h-[44px] shadow-2xs"
                          />
                        </div>
                      </div>

                      <div class="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          (click)="itemEmEdicao.set(null)"
                          class="px-3.5 py-2 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 min-h-[44px] flex items-center font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          (click)="salvarExecucao(item)"
                          [disabled]="salvando()"
                          class="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors min-h-[44px] flex items-center shadow-xs disabled:opacity-50"
                        >
                          {{ salvando() ? 'Salvando...' : 'Salvar Carga' }}
                        </button>
                      </div>
                    </div>
                  } @else {
                    <button
                      type="button"
                      (click)="abrirRegistroExecucao(item)"
                      class="w-full py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 min-h-[44px] shadow-2xs"
                    >
                      <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Registrar Carga de Hoje
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
      } @else {
        <div class="rounded-xl bg-white border border-slate-200 p-8 text-center space-y-3 shadow-xs">
          <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
            <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-sm font-bold text-slate-900">Nenhuma ficha ativa encontrada</h3>
          <p class="text-xs text-slate-500 max-w-xs mx-auto">
            Peça ao seu instrutor para prescrever sua ficha personalizada no sistema.
          </p>
        </div>
      }
    </div>
  `
})
export class FichaVisualizacaoMobileComponent implements OnInit {
  @Input() alunoId?: number;

  private treinoService = inject(TreinoService);

  ficha = this.treinoService.fichaAtiva;
  divisaoAtiva = signal<DivisaoTreino | null>(null);

  itemEmEdicao = signal<ItemDivisao | null>(null);
  execucaoCarga: number = 0;
  execucaoReps: number = 10;
  salvando = signal<boolean>(false);
  sucessoFeedback = signal<string | null>(null);

  ngOnInit(): void {
    if (this.alunoId) {
      this.treinoService.buscarFichaAtiva(this.alunoId).subscribe({
        next: (f) => this.inicializarDivisao(f)
      });
    } else {
      this.treinoService.buscarMinhaFichaAtiva().subscribe({
        next: (f) => this.inicializarDivisao(f)
      });
    }
  }

  private inicializarDivisao(f: any): void {
    if (f && f.divisoes && f.divisoes.length > 0) {
      this.divisaoAtiva.set(f.divisoes[0]);
    }
  }

  selecionarDivisao(div: DivisaoTreino): void {
    this.divisaoAtiva.set(div);
    this.itemEmEdicao.set(null);
  }

  abrirRegistroExecucao(item: ItemDivisao): void {
    this.itemEmEdicao.set(item);
    this.execucaoCarga = item.cargaKg || 0;
    this.execucaoReps = parseInt(item.repeticoes) || 10;
  }

  salvarExecucao(item: ItemDivisao): void {
    this.salvando.set(true);
    const req: RegistrarExecucaoRequest = {
      itemDivisaoId: item.id,
      cargaUtilizadaKg: this.execucaoCarga,
      repeticoesRealizadas: this.execucaoReps,
      seriesConcluidas: item.series,
      observacoes: 'Registrado via app'
    };

    this.treinoService.registrarExecucao(req).subscribe({
      next: (res) => {
        this.salvando.set(false);
        this.itemEmEdicao.set(null);
        this.sucessoFeedback.set(`Carga de ${res.cargaUtilizadaKg} kg registrada para ${res.exercicioNome}!`);
        item.cargaKg = res.cargaUtilizadaKg;
      },
      error: (err) => {
        this.salvando.set(false);
        console.error('Erro ao salvar execucao:', err);
      }
    });
  }
}
