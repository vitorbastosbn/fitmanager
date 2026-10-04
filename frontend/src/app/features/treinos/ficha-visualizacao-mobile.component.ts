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
    <div class="max-w-md mx-auto p-4 space-y-6">
      <!-- Header -->
      <div class="space-y-1">
        <span class="text-xs uppercase font-bold tracking-widest text-amber-500">Meu Programa de Treino</span>
        <h2 class="text-2xl font-black text-white tracking-tight">Ficha Vigente</h2>
        @if (ficha()) {
          <p class="text-xs text-neutral-400">
            Objetivo: <span class="text-white font-semibold">{{ ficha()!.objetivo }}</span> &bull; Instrutor: {{ ficha()!.instrutorNome }}
          </p>
        }
      </div>

      @if (sucessoFeedback()) {
        <div class="rounded-2xl bg-emerald-950/80 border border-emerald-800 p-3.5 text-xs text-emerald-300 flex items-center justify-between animate-fade-in">
          <span>{{ sucessoFeedback() }}</span>
          <button (click)="sucessoFeedback.set(null)" class="text-emerald-400 font-bold">&times;</button>
        </div>
      }

      @if (ficha()) {
        <!-- Division Tabs (A, B, C...) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          @for (div of ficha()!.divisoes; track div.id; let idx = $index) {
            <button
              (click)="selecionarDivisao(div)"
              [class]="divisaoAtiva()?.id === div.id ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20' : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'"
              class="px-5 py-3 rounded-2xl text-xs whitespace-nowrap transition-all flex items-center gap-2"
            >
              <span class="w-5 h-5 rounded-lg bg-black/20 flex items-center justify-center text-xs font-black">
                {{ div.letra }}
              </span>
              <span>{{ div.nome }}</span>
            </button>
          }
        </div>

        <!-- Exercises List in Active Division -->
        @if (divisaoAtiva()) {
          <div class="space-y-4">
            @for (item of divisaoAtiva()!.itens; track item.id; let itemIdx = $index) {
              <div class="rounded-3xl bg-neutral-900 border border-neutral-800 p-5 shadow-lg space-y-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <span class="text-xs font-mono font-bold text-amber-500">EXERCÍCIO #{{ item.ordemExecucao }}</span>
                    <h3 class="text-lg font-bold text-white leading-tight mt-0.5">{{ item.exercicioNome }}</h3>
                    <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-400">
                      {{ item.grupoMuscular }}
                    </span>
                  </div>
                </div>

                <!-- Prescribed Metrics Chips -->
                <div class="grid grid-cols-3 gap-2 bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80 text-center">
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-neutral-500">Séries x Reps</span>
                    <span class="text-sm font-black text-white">{{ item.series }} &times; {{ item.repeticoes }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-neutral-500">Carga</span>
                    <span class="text-sm font-black text-amber-400">{{ item.cargaKg }} kg</span>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-neutral-500">Descanso</span>
                    <span class="text-sm font-black text-neutral-300">{{ item.descansoSegundos }}s</span>
                  </div>
                </div>

                @if (item.observacoes) {
                  <p class="text-xs text-neutral-400 italic bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/40">
                    Obs: {{ item.observacoes }}
                  </p>
                }

                <!-- Action to register execution -->
                <div class="pt-2">
                  @if (itemEmEdicao()?.id === item.id) {
                    <!-- Inline Execution Form -->
                    <div class="bg-neutral-950 rounded-2xl p-4 border border-amber-500/40 space-y-3 animate-fade-in">
                      <span class="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        Registrar Treino de Hoje
                      </span>

                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[10px] uppercase text-neutral-400 font-bold mb-1">Carga Real (kg)</label>
                          <input
                            type="number"
                            step="0.5"
                            [(ngModel)]="execucaoCarga"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label class="block text-[10px] uppercase text-neutral-400 font-bold mb-1">Reps Cumpridas</label>
                          <input
                            type="number"
                            [(ngModel)]="execucaoReps"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div class="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          (click)="itemEmEdicao.set(null)"
                          class="px-3 py-1.5 rounded-xl text-xs text-neutral-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          (click)="salvarExecucao(item)"
                          [disabled]="salvando()"
                          class="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
                        >
                          {{ salvando() ? 'Salvando...' : 'Salvar Carga' }}
                        </button>
                      </div>
                    </div>
                  } @else {
                    <button
                      type="button"
                      (click)="abrirRegistroExecucao(item)"
                      class="w-full py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <span class="text-amber-400 font-bold">+</span> Registrar Carga de Hoje
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
      } @else {
        <div class="rounded-3xl bg-neutral-900 border border-neutral-800 p-8 text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500 text-xl font-bold">
            !
          </div>
          <h3 class="text-base font-bold text-white">Nenhuma ficha ativa encontrada</h3>
          <p class="text-xs text-neutral-400">
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
