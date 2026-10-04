import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LgpdService } from '../../core/services/lgpd.service';
import { LogAuditoriaLgpd } from '../../core/models/lgpd.models';

@Component({
  selector: 'app-auditoria-lgpd',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Trilha de Auditoria Regulamentar
            </span>
            <span class="text-xs text-neutral-400">Compliance & Governança LGPD</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight mt-1">
            Logs de Auditoria LGPD
          </h1>
          <p class="text-sm text-neutral-400 mt-1">
            Registro imutável de eventos de consentimento, exportações de dados e solicitações de anonimização.
          </p>
        </div>

        <button
          (click)="carregarLogs(currentPage())"
          class="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span>🔄</span>
          <span>Atualizar Trilha</span>
        </button>
      </div>

      <!-- Tabela de Logs -->
      <div class="bg-neutral-900/60 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-neutral-300">
            <thead class="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th class="py-4 px-6">Data / Hora</th>
                <th class="py-4 px-6">Ação Realizada</th>
                <th class="py-4 px-6">Titular dos Dados</th>
                <th class="py-4 px-6">Operador Responsável</th>
                <th class="py-4 px-6">IP Origem</th>
                <th class="py-4 px-6">Detalhes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/60">
              @if (carregando()) {
                <tr>
                  <td colspan="6" class="py-12 text-center text-neutral-500">
                    <div class="flex items-center justify-center gap-2">
                      <span class="animate-spin text-lg">⏳</span>
                      <span>Carregando trilha de auditoria...</span>
                    </div>
                  </td>
                </tr>
              } @else if (logs().length === 0) {
                <tr>
                  <td colspan="6" class="py-12 text-center text-neutral-500">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              } @else {
                @for (log of logs(); track log.id) {
                  <tr class="hover:bg-neutral-800/40 transition-colors">
                    <td class="py-4 px-6 text-neutral-400 font-mono">
                      {{ formatarData(log.criadoEm) }}
                    </td>
                    <td class="py-4 px-6">
                      <span
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
                        [ngClass]="getBadgeClass(log.acao)"
                      >
                        {{ log.acao }}
                      </span>
                    </td>
                    <td class="py-4 px-6 font-semibold text-white">
                      {{ log.titularNome }}
                    </td>
                    <td class="py-4 px-6 text-neutral-300">
                      {{ log.operadorNome }}
                    </td>
                    <td class="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      {{ log.ipOrigem || '—' }}
                    </td>
                    <td class="py-4 px-6 text-neutral-400 max-w-xs truncate" [title]="log.detalhes">
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
          <div class="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/40 text-xs text-neutral-400">
            <span>
              Página {{ currentPage() + 1 }} de {{ totalPages() }} ({{ totalElements() }} registros totais)
            </span>
            <div class="flex items-center gap-2">
              <button
                (click)="mudarPagina(currentPage() - 1)"
                [disabled]="currentPage() === 0"
                class="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium"
              >
                Anterior
              </button>
              <button
                (click)="mudarPagina(currentPage() + 1)"
                [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium"
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
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'EXPORTACAO_DADOS':
        return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
      case 'ANONIMIZACAO':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border border-neutral-700';
    }
  }
}
