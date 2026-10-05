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
      <!-- Cabeçalho Corporativo -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Quadro de Colaboradores</h1>
          <p class="text-xs text-slate-500 mt-0.5">Gestão administrativa de instrutores, recepcionistas e administradores</p>
        </div>
        <button
          (click)="abrirModalNovo()"
          class="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Novo Colaborador</span>
        </button>
      </div>

      <!-- Barra de Busca -->
      <div class="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
        <div class="relative">
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
      </div>

      <!-- Conteúdo: Tabela Desktop + Cards Mobile -->
      <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        @if (loading()) {
          <div class="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
            <svg class="animate-spin h-7 w-7 text-slate-700" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xs">Carregando quadro de colaboradores...</span>
          </div>
        } @else if (colaboradores().length === 0) {
          <div class="p-12 text-center text-slate-500 text-xs">
            Nenhum colaborador encontrado com os filtros informados.
          </div>
        } @else {
          <!-- Visão Mobile: Lista de Cards Adaptativos (md:hidden) -->
          <div class="md:hidden divide-y divide-slate-100">
            @for (colab of colaboradores(); track colab.id) {
              <div class="p-4 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="font-semibold text-slate-900 text-sm">{{ colab.nome }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">{{ colab.email }} &bull; {{ colab.telefone }}</div>
                  </div>
                  <div>
                    @if (colab.ativo) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Ativo</span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Inativo</span>
                    }
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Cargo</span>
                    <span class="font-medium text-slate-700">
                      {{ colab.cargoPerfil === 'ROLE_ADMIN' ? 'Administrador' : colab.cargoPerfil === 'ROLE_INSTRUTOR' ? 'Instrutor' : 'Recepcionista' }}
                    </span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Turno</span>
                    <span class="font-medium text-slate-700">{{ formatarTurno(colab.turno) }}</span>
                  </div>
                  @if (colab.cref) {
                    <div class="col-span-2">
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Registro CREF</span>
                      <span class="font-mono font-medium text-slate-800">{{ colab.cref }}</span>
                    </div>
                  }
                </div>

                <div class="flex items-center justify-end space-x-2 pt-1">
                  <button
                    (click)="abrirModalEdicao(colab)"
                    class="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
                  >
                    Editar
                  </button>
                  <button
                    (click)="alternarStatus(colab)"
                    [class]="colab.ativo ? 'px-3 py-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors' : 'px-3 py-1.5 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition-colors'"
                  >
                    {{ colab.ativo ? 'Inativar' : 'Ativar' }}
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Visão Desktop: Tabela Completa (hidden md:block) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-700">
              <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th class="px-6 py-3.5">Colaborador</th>
                  <th class="px-6 py-3.5">Cargo / Perfil</th>
                  <th class="px-6 py-3.5">Turno</th>
                  <th class="px-6 py-3.5">CREF</th>
                  <th class="px-6 py-3.5">Status</th>
                  <th class="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (colab of colaboradores(); track colab.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-3.5">
                      <div class="font-semibold text-slate-900">{{ colab.nome }}</div>
                      <div class="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{{ colab.email }}</span>
                        <span>&bull;</span>
                        <span>{{ colab.telefone }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-3.5">
                      @if (colab.cargoPerfil === 'ROLE_ADMIN') {
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">Administrador</span>
                      } @else if (colab.cargoPerfil === 'ROLE_INSTRUTOR') {
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Instrutor</span>
                      } @else {
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Recepcionista</span>
                      }
                    </td>
                    <td class="px-6 py-3.5">
                      <span class="text-xs font-medium text-slate-600">{{ formatarTurno(colab.turno) }}</span>
                    </td>
                    <td class="px-6 py-3.5">
                      @if (colab.cref) {
                        <span class="font-mono text-xs text-slate-900 font-semibold">{{ colab.cref }}</span>
                      } @else {
                        <span class="text-slate-400 text-xs">-</span>
                      }
                    </td>
                    <td class="px-6 py-3.5">
                      @if (colab.ativo) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Ativo</span>
                      } @else {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">Inativo</span>
                      }
                    </td>
                    <td class="px-6 py-3.5 text-right space-x-2">
                      <button
                        (click)="abrirModalEdicao(colab)"
                        class="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs"
                      >
                        Editar
                      </button>
                      <button
                        (click)="alternarStatus(colab)"
                        [class]="colab.ativo ? 'px-2.5 py-1 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors' : 'px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium transition-colors'"
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
