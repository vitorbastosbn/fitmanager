import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceiroService } from '../../core/services/financeiro.service';
import { AuthService } from '../../core/services/auth.service';
import { Cobranca, PagamentoResponse } from '../../core/models/financeiro.models';
import { PagamentoModalComponent } from './pagamento-modal.component';

@Component({
  selector: 'app-cobrancas-table',
  standalone: true,
  imports: [CommonModule, PagamentoModalComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900 tracking-tight">Histórico Financeiro e Cobranças</h3>
          <p class="text-xs text-slate-500">Acompanhamento de faturas, vencimentos e liquidações</p>
        </div>
        <button
          (click)="recarregar()"
          class="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
      </div>

      @if (sucessoMsg()) {
        <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-medium">{{ sucessoMsg() }}</span>
          </div>
          <button (click)="sucessoMsg.set(null)" class="text-emerald-700 hover:text-emerald-900 font-bold p-1">&times;</button>
        </div>
      }

      <!-- Mobile Cards View (< md) -->
      <div class="space-y-3 md:hidden">
        @for (cobranca of financeiroService.cobrancas(); track cobranca.id) {
          <div class="rounded-xl bg-white border border-slate-200 p-4 shadow-xs space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xs text-slate-400 font-medium">#{{ cobranca.id }}</span>
              @switch (cobranca.status) {
                @case ('PENDENTE') {
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Pendente
                  </span>
                }
                @case ('ATRASADO') {
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    Atrasado
                  </span>
                }
                @case ('PAGO') {
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Pago
                  </span>
                }
                @case ('CANCELADO') {
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Cancelado
                  </span>
                }
              }
            </div>

            <div>
              <div class="text-sm font-bold text-slate-900">{{ cobranca.alunoNome }}</div>
              <div class="text-xs text-slate-500 mt-0.5">Vencimento: {{ cobranca.dataVencimento }}</div>
            </div>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Valor</span>
                <span class="text-base font-bold text-slate-900">R$ {{ cobranca.valor.toFixed(2) }}</span>
              </div>
              @if (permiteQuitar && cobranca.status === 'PENDENTE') {
                <button
                  (click)="abrirModalPagamento(cobranca)"
                  class="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs min-h-[38px] flex items-center"
                >
                  Quitar
                </button>
              }
            </div>
          </div>
        } @empty {
          <div class="rounded-xl bg-white border border-slate-200 p-8 text-center text-slate-400 text-xs shadow-xs">
            Nenhuma fatura encontrada.
          </div>
        }
      </div>

      <!-- Desktop Table View (>= md) -->
      <div class="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <table class="w-full text-left text-xs text-slate-600">
          <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">Aluno</th>
              <th class="px-5 py-3">Vencimento</th>
              <th class="px-5 py-3">Valor</th>
              <th class="px-5 py-3">Status</th>
              @if (permiteQuitar) {
                <th class="px-5 py-3 text-right">Ação</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (cobranca of financeiroService.cobrancas(); track cobranca.id) {
              <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="px-5 py-3 font-mono text-slate-400">#{{ cobranca.id }}</td>
                <td class="px-5 py-3 font-medium text-slate-900">{{ cobranca.alunoNome }}</td>
                <td class="px-5 py-3 text-slate-600">{{ cobranca.dataVencimento }}</td>
                <td class="px-5 py-3 font-bold text-slate-900">R$ {{ cobranca.valor.toFixed(2) }}</td>
                <td class="px-5 py-3">
                  @switch (cobranca.status) {
                    @case ('PENDENTE') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Pendente
                      </span>
                    }
                    @case ('ATRASADO') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Atrasado
                      </span>
                    }
                    @case ('PAGO') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Pago
                      </span>
                    }
                    @case ('CANCELADO') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Cancelado
                      </span>
                    }
                  }
                </td>
                @if (permiteQuitar) {
                  <td class="px-5 py-3 text-right">
                    @if (cobranca.status === 'PENDENTE') {
                      <button
                        (click)="abrirModalPagamento(cobranca)"
                        class="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
                      >
                        Quitar
                      </button>
                    } @else {
                      <span class="text-xs text-slate-300">-</span>
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="permiteQuitar ? 6 : 5" class="px-5 py-8 text-center text-slate-400 text-xs">
                  Nenhuma fatura encontrada.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (cobrancaSelecionada()) {
        <app-pagamento-modal
          [cobranca]="cobrancaSelecionada()!"
          (pago)="aoConfirmarPagamento($event)"
          (close)="cobrancaSelecionada.set(null)"
        />
      }
    </div>
  `
})
export class CobrancasTableComponent implements OnInit {
  @Input() alunoId?: number;
  @Input() matriculaId?: number;
  @Input() modoAluno = false;
  @Input() permiteQuitar = true;

  financeiroService = inject(FinanceiroService);
  authService = inject(AuthService);

  cobrancaSelecionada = signal<Cobranca | null>(null);
  sucessoMsg = signal<string | null>(null);

  ngOnInit(): void {
    if (this.authService.currentUser()?.perfil === 'ROLE_ALUNO') {
      this.modoAluno = true;
      this.permiteQuitar = false;
    }
    this.recarregar();
  }

  recarregar(): void {
    if (this.modoAluno) {
      this.financeiroService.extratoAluno().subscribe();
    } else {
      this.financeiroService.listarCobrancas({
        alunoId: this.alunoId,
        matriculaId: this.matriculaId
      }).subscribe();
    }
  }

  abrirModalPagamento(cobranca: Cobranca): void {
    this.cobrancaSelecionada.set(cobranca);
  }

  aoConfirmarPagamento(res: PagamentoResponse): void {
    this.cobrancaSelecionada.set(null);
    this.sucessoMsg.set(`Pagamento da fatura #${res.cobrancaId} de R$ ${res.valorPago.toFixed(2)} registrado com sucesso!`);
    this.recarregar();
  }
}
