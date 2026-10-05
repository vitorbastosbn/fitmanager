import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LgpdService } from '../../core/services/lgpd.service';
import { LogAuditoriaLgpd } from '../../core/models/lgpd.models';

@Component({
  selector: 'app-auditoria-lgpd',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto animate-fade-in p-4 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Trilha de Auditoria Regulamentar
            </span>
            <span class="text-xs text-slate-500">Compliance & Governança LGPD</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Logs de Auditoria LGPD
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            Registro imutável de eventos de consentimento, exportações de dados e solicitações de anonimização.
          </p>
        </div>

        <button
          (click)="carregarLogs(currentPage())"
          class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto min-h-[36px]"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Atualizar Trilha</span>
        </button>
      </div>

      <!-- Mobile Card List View (< md) -->
      <div class="space-y-3 md:hidden">
        @if (carregando()) {
          <div class="p-8 text-center text-slate-400 text-xs">
            Carregando trilha de auditoria...
          </div>
        } @else if (logs().length === 0) {
          <div class="p-8 rounded-xl bg-white border border-slate-200 text-center text-slate-400 text-xs shadow-xs">
            Nenhum registro de auditoria encontrado.
          </div>
        } @else {
          @for (log of logs(); track log.id) {
            <div class="rounded-xl bg-white border border-slate-200 p-4 shadow-xs space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide" [ngClass]="getBadgeClass(log.acao)">
                  {{ log.acao }}
                </span>
                <span class="text-slate-400 font-mono text-[11px]">{{ formatarData(log.criadoEm) }}</span>
              </div>

              <div>
                <div class="text-xs font-bold text-slate-900">{{ log.titularNome }}</div>
                <div class="text-[11px] text-slate-500 mt-0.5">Operador: {{ log.operadorNome }} &bull; IP: {{ log.ipOrigem || '—' }}</div>
              </div>

              @if (log.detalhes) {
                <div class="pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-md">
                  {{ log.detalhes }}
                </div>
              }
            </div>
          }
        }
      </div>

      <!-- Desktop Table View (>= md) -->
      <div class="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600">
            <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th class="py-3 px-5">Data / Hora</th>
                <th class="py-3 px-5">Ação Realizada</th>
                <th class="py-3 px-5">Titular dos Dados</th>
                <th class="py-3 px-5">Operador Responsável</th>
                <th class="py-3 px-5">IP Origem</th>
                <th class="py-3 px-5">Detalhes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @if (carregando()) {
                <tr>
                  <td colspan="6" class="py-12 text-center text-slate-400">
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando trilha de auditoria...</span>
                    </div>
                  </td>
                </tr>
              } @else if (logs().length === 0) {
                <tr>
                  <td colspan="6" class="py-12 text-center text-slate-400">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              } @else {
                @for (log of logs(); track log.id) {
                  <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="py-3 px-5 text-slate-500 font-mono text-[11px]">
                      {{ formatarData(log.criadoEm) }}
                    </td>
                    <td class="py-3 px-5">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
                        [ngClass]="getBadgeClass(log.acao)"
                      >
                        {{ log.acao }}
                      </span>
                    </td>
                    <td class="py-3 px-5 font-semibold text-slate-900">
                      {{ log.titularNome }}
                    </td>
                    <td class="py-3 px-5 text-slate-700">
                      {{ log.operadorNome }}
                    </td>
                    <td class="py-3 px-5 text-slate-400 font-mono text-[11px]">
                      {{ log.ipOrigem || '—' }}
                    </td>
                    <td class="py-3 px-5 text-slate-500 max-w-xs truncate" [title]="log.detalhes">
                      {{ log.detalhes }}
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Paginação -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            <span>
              Página {{ currentPage() + 1 }} de {{ totalPages() }} ({{ totalElements() }} registros totais)
            </span>
            <div class="flex items-center gap-2">
              <button
                (click)="mudarPagina(currentPage() - 1)"
                [disabled]="currentPage() === 0"
                class="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium shadow-2xs"
              >
                Anterior
              </button>
              <button
                (click)="mudarPagina(currentPage() + 1)"
                [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium shadow-2xs"
              >
                Próxima
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AuditoriaLgpdComponent implements OnInit {
  private readonly lgpdService = inject(LgpdService);

  logs = signal<LogAuditoriaLgpd[]>([]);
  carregando = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  ngOnInit(): void {
    this.carregarLogs(0);
  }

  carregarLogs(pagina: number): void {
    this.carregando.set(true);
    this.lgpdService.listarAuditoria(pagina, 15).subscribe({
      next: (res) => {
        this.logs.set(res.content);
        this.currentPage.set(res.number);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      }
    });
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 0 && novaPagina < this.totalPages()) {
      this.carregarLogs(novaPagina);
    }
  }

  formatarData(isoStr?: string): string {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return isoStr;
    }
  }

  getBadgeClass(acao: string): string {
    switch (acao) {
      case 'ACEITE_TERMO':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'EXPORTACAO_DADOS':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'ANONIMIZACAO':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  }
}
