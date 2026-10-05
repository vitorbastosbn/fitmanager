import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Aluno, Page } from '../../core/models/aluno.models';
import { AlunoService } from '../../core/services/aluno.service';
import { AlunoFormComponent } from './aluno-form.component';
import { MascararCpfPipe } from '../../shared/pipes/mascarar-cpf.pipe';

@Component({
  selector: 'app-aluno-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlunoFormComponent, MascararCpfPipe],
  template: `
    <div class="space-y-6">
      <!-- Cabeçalho da Página -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Alunos</h1>
          <p class="text-xs text-slate-500 mt-0.5">Base cadastral, status de matrículas e fichas de membros</p>
        </div>
        <button
          (click)="abrirModalNovo()"
          class="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Aluno</span>
        </button>
      </div>

      <!-- Barra de Filtros e Busca -->
      <div class="bg-white border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row gap-3 shadow-xs">
        <div class="flex-1 relative">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [formControl]="buscaControl"
            placeholder="Filtrar por nome ou CPF..."
            class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          [formControl]="statusControl"
          class="px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        >
          <option value="">Todos os Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
          <option value="TRANCADO">Trancado</option>
        </select>
      </div>

      <!-- Conteúdo: Cards Mobile + Tabela Desktop -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        @if (loading()) {
          <div class="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
            <svg class="animate-spin h-7 w-7 text-slate-700" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-xs">Carregando quadro de alunos...</p>
          </div>
        } @else if (alunos().length === 0) {
          <div class="p-12 text-center text-slate-500">
            <p class="text-sm font-semibold text-slate-700">Nenhum aluno encontrado</p>
            <p class="text-xs text-slate-400 mt-1">Cadastre um novo aluno ou redefina os filtros de pesquisa</p>
          </div>
        } @else {
          <!-- Visão Mobile: Lista de Cards Adaptativos (md:hidden) -->
          <div class="md:hidden divide-y divide-slate-100">
            @for (aluno of alunos(); track aluno.id) {
              <div class="p-4 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="font-semibold text-slate-900 text-sm">{{ aluno.nome }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">{{ aluno.email }} &bull; {{ aluno.telefone }}</div>
                  </div>
                  <div>
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      [ngClass]="{
                        'bg-emerald-50 text-emerald-700 border border-emerald-200': aluno.status === 'ATIVO',
                        'bg-rose-50 text-rose-700 border border-rose-200': aluno.status === 'INATIVO',
                        'bg-amber-50 text-amber-700 border border-amber-200': aluno.status === 'TRANCADO'
                      }"
                    >
                      {{ aluno.status }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] uppercase font-bold">CPF</span>
                  <span class="font-mono text-slate-700 font-medium">{{ aluno.cpf | mascararCpf }}</span>
                </div>

                <div class="flex items-center justify-end space-x-2 pt-1">
                  <button
                    (click)="editarAluno(aluno)"
                    class="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
                  >
                    Editar Dados
                  </button>
                  @if (aluno.status === 'ATIVO') {
                    <button
                      (click)="inativarAluno(aluno.id)"
                      class="px-3 py-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors"
                    >
                      Inativar
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Visão Desktop: Tabela Tradicional (hidden md:block) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-700">
              <thead class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th class="py-3.5 px-6">Nome / Contato</th>
                  <th class="py-3.5 px-6">CPF</th>
                  <th class="py-3.5 px-6">Status</th>
                  <th class="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (aluno of alunos(); track aluno.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="py-4 px-6">
                      <div class="font-semibold text-slate-900">{{ aluno.nome }}</div>
                      <div class="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{{ aluno.email }}</span>
                        <span>&bull;</span>
                        <span>{{ aluno.telefone }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-6 font-mono text-xs text-slate-700">
                      {{ aluno.cpf | mascararCpf }}
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-700 border border-emerald-200': aluno.status === 'ATIVO',
                          'bg-rose-50 text-rose-700 border border-rose-200': aluno.status === 'INATIVO',
                          'bg-amber-50 text-amber-700 border border-amber-200': aluno.status === 'TRANCADO'
                        }"
                      >
                        {{ aluno.status }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-right space-x-2">
                      <button
                        (click)="editarAluno(aluno)"
                        class="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
                        title="Editar"
                      >
                        Editar
                      </button>
                      @if (aluno.status === 'ATIVO') {
                        <button
                          (click)="inativarAluno(aluno.id)"
                          class="px-2.5 py-1 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors"
                          title="Inativar"
                        >
                          Inativar
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Modal de Formulário (Criação / Edição) -->
      @if (modalAberto()) {
        <app-aluno-form
          [alunoEdicao]="alunoSelecionado()"
          (salvo)="onAlunoSalvo()"
          (cancelar)="fecharModal()"
        />
      }
    </div>
  `
})
export class AlunoListComponent implements OnInit {
  private readonly alunoService = inject(AlunoService);

  readonly alunos = signal<Aluno[]>([]);
  readonly loading = signal(false);
  readonly modalAberto = signal(false);
  readonly alunoSelecionado = signal<Aluno | null>(null);

  readonly buscaControl = new FormControl('');
  readonly statusControl = new FormControl('');

  ngOnInit(): void {
    this.carregarAlunos();

    this.buscaControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.carregarAlunos());

    this.statusControl.valueChanges.subscribe(() => this.carregarAlunos());
  }

  carregarAlunos(): void {
    this.loading.set(true);
    const termo = this.buscaControl.value || undefined;
    const status = this.statusControl.value || undefined;

    this.alunoService.listar(termo, status).subscribe({
      next: (page: Page<Aluno>) => {
        this.alunos.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  abrirModalNovo(): void {
    this.alunoSelecionado.set(null);
    this.modalAberto.set(true);
  }

  editarAluno(aluno: Aluno): void {
    this.alunoSelecionado.set(aluno);
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.alunoSelecionado.set(null);
  }

  onAlunoSalvo(): void {
    this.fecharModal();
    this.carregarAlunos();
  }

  inativarAluno(id: number): void {
    if (confirm('Deseja realmente inativar este aluno?')) {
      this.alunoService.inativar(id).subscribe(() => this.carregarAlunos());
    }
  }
}
