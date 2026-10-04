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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">Gestão de Alunos</h1>
          <p class="text-sm text-slate-400">Cadastre e gerencie a base de membros da academia</p>
        </div>
        <button
          (click)="abrirModalNovo()"
          class="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Aluno</span>
        </button>
      </div>

      <!-- Barra de Filtros e Busca -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [formControl]="buscaControl"
            placeholder="Buscar por nome ou CPF..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          [formControl]="statusControl"
          class="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="">Todos os Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
          <option value="TRANCADO">Trancado</option>
        </select>
      </div>

      <!-- Tabela de Alunos -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        @if (loading()) {
          <div class="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm">Carregando alunos...</p>
          </div>
        } @else if (alunos().length === 0) {
          <div class="p-12 text-center text-slate-500">
            <svg class="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-base font-semibold text-slate-400">Nenhum aluno encontrado</p>
            <p class="text-xs text-slate-500 mt-1">Cadastre um novo aluno ou altere os filtros de pesquisa</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th class="py-3.5 px-6">Nome / Contato</th>
                  <th class="py-3.5 px-6">CPF</th>
                  <th class="py-3.5 px-6">Status</th>
                  <th class="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (aluno of alunos(); track aluno.id) {
                  <tr class="hover:bg-slate-800/30 transition-colors">
                    <td class="py-4 px-6">
                      <div class="font-bold text-white">{{ aluno.nome }}</div>
                      <div class="text-xs text-slate-400">{{ aluno.email }} • {{ aluno.telefone }}</div>
                    </td>
                    <td class="py-4 px-6 font-mono text-xs text-slate-300">
                      {{ aluno.cpf | mascararCpf }}
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        [ngClass]="{
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': aluno.status === 'ATIVO',
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20': aluno.status === 'INATIVO',
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20': aluno.status === 'TRANCADO'
                        }"
                      >
                        {{ aluno.status }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-right space-x-2">
                      <button
                        (click)="editarAluno(aluno)"
                        class="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      @if (aluno.status === 'ATIVO') {
                        <button
                          (click)="inativarAluno(aluno.id)"
                          class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Inativar"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
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
