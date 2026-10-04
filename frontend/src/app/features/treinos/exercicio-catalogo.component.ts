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
    <div class="space-y-6 max-w-6xl mx-auto p-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-amber-500">Biblioteca Esportiva</span>
          <h2 class="text-2xl font-black text-white tracking-tight">Catálogo de Exercícios</h2>
          <p class="text-xs text-neutral-400 mt-1">Exercícios pré-cadastrados para prescrição de treinos</p>
        </div>

        <div class="relative w-full md:w-72">
          <input
            type="text"
            [(ngModel)]="busca"
            placeholder="Buscar por exercício..."
            class="w-full rounded-2xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <!-- Filter Chips -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          (click)="selecionarGrupo(null)"
          [class]="grupoSelecionado() === null ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'"
          class="px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-colors"
        >
          Todos ({{ totalCount() }})
        </button>
        @for (g of grupos; track g) {
          <button
            (click)="selecionarGrupo(g)"
            [class]="grupoSelecionado() === g ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'"
            class="px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-colors"
          >
            {{ formatarGrupo(g) }}
          </button>
        }
      </div>

      <!-- Exercise Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (ex of exerciciosFiltrados(); track ex.id) {
          <div class="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 hover:border-neutral-700 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span [class]="getBadgeClass(ex.grupoMuscular)" class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {{ formatarGrupo(ex.grupoMuscular) }}
                </span>
                <span class="text-neutral-600 font-mono text-xs">#{{ ex.id }}</span>
              </div>
              <h3 class="text-base font-bold text-white mt-2">{{ ex.nome }}</h3>
              <p class="text-xs text-neutral-400 line-clamp-3 mt-1 leading-relaxed">
                {{ ex.instrucoes || 'Sem orientações adicionais.' }}
              </p>
            </div>

            <div class="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
              <span class="inline-flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ativo no catálogo
              </span>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-12 text-center text-neutral-500 text-sm">
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
      PEITO: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
      COSTAS: 'bg-blue-950/80 text-blue-400 border border-blue-800/50',
      PERNAS: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50',
      OMBROS: 'bg-purple-950/80 text-purple-400 border border-purple-800/50',
      BRACOS: 'bg-orange-950/80 text-orange-400 border border-orange-800/50',
      ABDOMEN: 'bg-teal-950/80 text-teal-400 border border-teal-800/50',
      CARDIO: 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
    };
    return classes[g] || 'bg-neutral-800 text-neutral-300';
  }
}
