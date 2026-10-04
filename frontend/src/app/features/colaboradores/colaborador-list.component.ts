import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Colaborador } from '../../core/models/colaborador.models';
import { Page } from '../../core/models/aluno.models';
import { ColaboradorService } from '../../core/services/colaborador.service';
import { ColaboradorFormComponent } from './colaborador-form.component';

@Component({
  selector: 'app-colaborador-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ColaboradorFormComponent],
  template: `
    <div class="space-y-6">
      <!-- Cabeçalho -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-white tracking-tight">Gestão de Colaboradores</h1>
          <p class="text-sm text-slate-400">Controle a equipe de administradores, recepcionistas e instrutores com registro CREF</p>
        </div>
        <button
          (click)="abrirModalNovo()"
          class="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Colaborador</span>
        </button>
      </div>

      <!-- Barra de Busca -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div class="flex-1 relative">
          <svg class="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [formControl]="buscaControl"
            placeholder="Buscar por nome ou CPF..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Tabela de Colaboradores -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        @if (loading()) {
          <div class="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <svg class="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm">Carregando quadro de colaboradores...</span>
          </div>
        } @else if (colaboradores().length === 0) {
          <div class="p-12 text-center text-slate-500">
            Nenhum colaborador encontrado. Clique em "Novo Colaborador" para cadastrar.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th class="px-6 py-4">Colaborador</th>
                  <th class="px-6 py-4">Cargo / Perfil</th>
                  <th class="px-6 py-4">Turno</th>
                  <th class="px-6 py-4">CREF</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                @for (colab of colaboradores(); track colab.id) {
                  <tr class="hover:bg-slate-800/30 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-bold text-white">{{ colab.nome }}</div>
                      <div class="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{{ colab.email }}</span>
                        <span>•</span>
                        <span>{{ colab.telefone }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      @if (colab.cargoPerfil === 'ROLE_ADMIN') {
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">Administrador</span>
                      } @else if (colab.cargoPerfil === 'ROLE_INSTRUTOR') {
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Instrutor</span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">Recepcionista</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-medium text-slate-300">{{ formatarTurno(colab.turno) }}</span>
                    </td>
                    <td class="px-6 py-4">
                      @if (colab.cref) {
                        <span class="font-mono text-xs text-amber-300 font-semibold">{{ colab.cref }}</span>
                      } @else {
                        <span class="text-slate-600 text-xs">-</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      @if (colab.ativo) {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ativo</span>
                      } @else {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Inativo</span>
                      }
                    </td>
                    <td class="px-6 py-4 text-right space-x-2">
                      <button
                        (click)="abrirModalEdicao(colab)"
                        class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        (click)="alternarStatus(colab)"
                        [class]="colab.ativo ? 'px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors border border-rose-500/20' : 'px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-colors border border-emerald-500/20'"
                      >
                        {{ colab.ativo ? 'Inativar' : 'Ativar' }}
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Modal de Cadastro / Edição -->
      @if (modalAberto()) {
        <app-colaborador-form
          [colaboradorEdicao]="colaboradorSelecionado()"
          (salvo)="onColaboradorSalvo()"
          (cancelar)="fecharModal()"
        />
      }
    </div>
  `
})
export class ColaboradorListComponent implements OnInit {
  private readonly colaboradorService = inject(ColaboradorService);

  colaboradores = signal<Colaborador[]>([]);
  loading = signal(false);
  modalAberto = signal(false);
  colaboradorSelecionado = signal<Colaborador | undefined>(undefined);

  buscaControl = new FormControl('');

  ngOnInit(): void {
    this.carregarColaboradores();

    this.buscaControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.carregarColaboradores());
  }

  carregarColaboradores(): void {
    this.loading.set(true);
    this.colaboradorService.listar(this.buscaControl.value || undefined, 0, 20).subscribe({
      next: (page: Page<Colaborador>) => {
        this.colaboradores.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  abrirModalNovo(): void {
    this.colaboradorSelecionado.set(undefined);
    this.modalAberto.set(true);
  }

  abrirModalEdicao(colaborador: Colaborador): void {
    this.colaboradorSelecionado.set(colaborador);
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.colaboradorSelecionado.set(undefined);
  }

  onColaboradorSalvo(): void {
    this.fecharModal();
    this.carregarColaboradores();
  }

  alternarStatus(colaborador: Colaborador): void {
    const novoStatus = !colaborador.ativo;
    const acao = novoStatus ? 'ativar' : 'inativar';
    if (confirm(`Tem certeza que deseja ${acao} o colaborador ${colaborador.nome}?`)) {
      this.colaboradorService.alterarStatus(colaborador.id, novoStatus).subscribe({
        next: () => this.carregarColaboradores(),
        error: (err) => alert(err.error?.detail || err.error?.message || 'Erro ao alterar status do colaborador.')
      });
    }
  }

  formatarTurno(turno: string): string {
    switch (turno) {
      case 'MANHA': return 'Manhã';
      case 'TARDE': return 'Tarde';
      case 'NOITE': return 'Noite';
      case 'INTEGRAL': return 'Integral';
      default: return turno;
    }
  }
}
