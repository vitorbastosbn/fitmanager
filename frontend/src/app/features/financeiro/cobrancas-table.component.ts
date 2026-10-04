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
        <h3 class="text-lg font-bold text-white tracking-tight">Histórico Financeiro e Cobranças</h3>
        <button
          (click)="recarregar()"
          class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
        >
          Atualizar
        </button>
      </div>

      @if (sucessoMsg()) {
        <div class="rounded-xl bg-emerald-950/60 border border-emerald-800 p-3 text-sm text-emerald-300 flex items-center justify-between">
          <span>{{ sucessoMsg() }}</span>
          <button (click)="sucessoMsg.set(null)" class="text-emerald-400 hover:text-white">&times;</button>
        </div>
      }

      <div class="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur">
        <table class="w-full text-left text-sm text-neutral-300">
          <thead class="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Aluno</th>
              <th class="px-6 py-4">Vencimento</th>
              <th class="px-6 py-4">Valor</th>
              <th class="px-6 py-4">Status</th>
              @if (permiteQuitar) {
                <th class="px-6 py-4 text-right">Ação</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800">
            @for (cobranca of financeiroService.cobrancas(); track cobranca.id) {
              <tr class="hover:bg-neutral-800/40 transition-colors">
                <td class="px-6 py-4 font-mono text-xs text-neutral-500">#{{ cobranca.id }}</td>
                <td class="px-6 py-4 font-medium text-white">{{ cobranca.alunoNome }}</td>
                <td class="px-6 py-4">{{ cobranca.dataVencimento }}</td>
                <td class="px-6 py-4 font-semibold text-white">R$ {{ cobranca.valor.toFixed(2) }}</td>
                <td class="px-6 py-4">
                  @switch (cobranca.status) {
                    @case ('PENDENTE') {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/80 text-amber-400 border border-amber-800/50">
                        Pendente
                      </span>
                    }
                    @case ('ATRASADO') {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/80 text-red-400 border border-red-800/50">
                        Atrasado
                      </span>
                    }
                    @case ('PAGO') {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                        Pago
                      </span>
                    }
                    @case ('CANCELADO') {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400 border border-neutral-700">
                        Cancelado
                      </span>
                    }
                  }
                </td>
                @if (permiteQuitar) {
                  <td class="px-6 py-4 text-right">
                    @if (cobranca.status === 'PENDENTE') {
                      <button
                        (click)="abrirModalPagamento(cobranca)"
                        class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
                      >
                        Quitar
                      </button>
                    } @else {
                      <span class="text-xs text-neutral-600">-</span>
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="permiteQuitar ? 6 : 5" class="px-6 py-8 text-center text-neutral-500">
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
