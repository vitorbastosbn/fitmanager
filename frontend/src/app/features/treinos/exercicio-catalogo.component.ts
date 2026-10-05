import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreinoService } from '../../core/services/treino.service';
import { Exercicio, GrupoMuscular } from '../../core/models/treino.models';

@Component({
  selector: 'app-exercicio-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span class="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">Biblioteca Esportiva</span>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight mt-0.5">Catálogo de Exercícios</h2>
          <p class="text-xs text-slate-500 mt-1">Exercícios pré-cadastrados para prescrição de treinos</p>
        </div>

        <div class="relative w-full md:w-72">
          <input
            type="text"
            [(ngModel)]="busca"
            placeholder="Buscar por exercício..."
            class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          (click)="selecionarGrupo(null)"
          [class]="grupoSelecionado() === null ? 'bg-slate-900 text-white font-medium shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs'"
          class="px-3.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors"
        >
          Todos ({{ totalCount() }})
        </button>
        @for (g of grupos; track g) {
          <button
            (click)="selecionarGrupo(g)"
            [class]="grupoSelecionado() === g ? 'bg-slate-900 text-white font-medium shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-2xs'"
            class="px-3.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors"
          >
            {{ formatarGrupo(g) }}
          </button>
        }
      </div>

      <!-- Exercise Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (ex of exerciciosFiltrados(); track ex.id) {
          <div class="rounded-xl bg-white border border-slate-200 p-4 hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between shadow-xs">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span [class]="getBadgeClass(ex.grupoMuscular)" class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                  {{ formatarGrupo(ex.grupoMuscular) }}
                </span>
                <span class="text-slate-400 font-mono text-[11px]">#{{ ex.id }}</span>
              </div>
              <h3 class="text-sm font-bold text-slate-900 mt-2">{{ ex.nome }}</h3>
              <p class="text-xs text-slate-500 line-clamp-3 mt-1 leading-relaxed">
                {{ ex.instrucoes || 'Sem orientações adicionais.' }}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ativo no catálogo
              </span>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-12 text-center text-slate-400 text-xs">
            Nenhum exercício encontrado com os filtros aplicados.
          </div>
        }
      </div>
    </div>
  `
})
export class ExercicioCatalogoComponent implements OnInit {
  private treinoService = inject(TreinoService);

  grupos: GrupoMuscular[] = ['PEITO', 'COSTAS', 'PERNAS', 'OMBROS', 'BRACOS', 'ABDOMEN', 'CARDIO'];
  grupoSelecionado = signal<GrupoMuscular | null>(null);
  busca = signal<string>('');

  exercicios = this.treinoService.exercicios;
  totalCount = computed(() => this.exercicios().length);

  exerciciosFiltrados = computed(() => {
    let list = this.exercicios();
    const g = this.grupoSelecionado();
    const q = this.busca().trim().toLowerCase();

    if (g) {
      list = list.filter(e => e.grupoMuscular === g);
    }
    if (q) {
      list = list.filter(e => e.nome.toLowerCase().includes(q) || (e.instrucoes && e.instrucoes.toLowerCase().includes(q)));
    }
    return list;
  });

  ngOnInit(): void {
    this.treinoService.listarExercicios().subscribe();
  }

  selecionarGrupo(grupo: GrupoMuscular | null): void {
    this.grupoSelecionado.set(grupo);
  }

  formatarGrupo(g: GrupoMuscular): string {
    const labels: Record<GrupoMuscular, string> = {
      PEITO: 'Peito',
      COSTAS: 'Costas',
      PERNAS: 'Pernas',
      OMBROS: 'Ombros',
      BRACOS: 'Braços',
      ABDOMEN: 'Abdômen',
      CARDIO: 'Cardio'
    };
    return labels[g] || g;
  }

  getBadgeClass(g: GrupoMuscular): string {
    const classes: Record<GrupoMuscular, string> = {
      PEITO: 'bg-slate-100 text-slate-700 border border-slate-200',
      COSTAS: 'bg-blue-50 text-blue-700 border border-blue-200',
      PERNAS: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      OMBROS: 'bg-purple-50 text-purple-700 border border-purple-200',
      BRACOS: 'bg-amber-50 text-amber-700 border border-amber-200',
      ABDOMEN: 'bg-teal-50 text-teal-700 border border-teal-200',
      CARDIO: 'bg-rose-50 text-rose-700 border border-rose-200'
    };
    return classes[g] || 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}
