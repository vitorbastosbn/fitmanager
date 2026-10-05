import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FinanceiroService } from '../../core/services/financeiro.service';
import { Cobranca, FormaPagamento, PagamentoResponse } from '../../core/models/financeiro.models';

@Component({
  selector: 'app-pagamento-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styles: [':host { display: block; }'],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="w-full max-w-md rounded-xl bg-white border border-slate-200 p-6 shadow-xl space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-base font-bold text-slate-900">Quitar Cobrança</h3>
            <p class="text-xs text-slate-500">Fatura #{{ cobranca.id }} &bull; {{ cobranca.alunoNome }}</p>
          </div>
          <button (click)="close.emit()" class="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none">&times;</button>
        </div>

        @if (errorMessage()) {
          <div class="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-center gap-2">
            <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Valor Original: <span class="font-bold text-slate-900">R$ {{ cobranca.valor.toFixed(2) }}</span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-slate-400 font-medium text-xs">R$</span>
              <input
                type="number"
                step="0.01"
                formControlName="valorPago"
                class="w-full rounded-md bg-white border border-slate-300 pl-9 pr-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1.5">
              Forma de Pagamento *
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                (click)="setForma('PIX')"
                [class]="form.value.formaPagamento === 'PIX'
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'"
                class="py-2 rounded-md text-xs transition-colors text-center min-h-[38px]"
              >
                PIX
              </button>
              <button
                type="button"
                (click)="setForma('CARTAO_CREDITO')"
                [class]="form.value.formaPagamento === 'CARTAO_CREDITO'
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'"
                class="py-2 rounded-md text-xs transition-colors text-center min-h-[38px]"
              >
                Crédito
              </button>
              <button
                type="button"
                (click)="setForma('CARTAO_DEBITO')"
                [class]="form.value.formaPagamento === 'CARTAO_DEBITO'
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'"
                class="py-2 rounded-md text-xs transition-colors text-center min-h-[38px]"
              >
                Débito
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Identificador da Transação (Opcional)
            </label>
            <input
                type="text"
                formControlName="identificadorTransacao"
                class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="Ex: NSU / Código PIX E2E"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">
              Observação (Opcional)
            </label>
            <textarea
                rows="2"
                formControlName="observacao"
                class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                placeholder="Observações do atendente"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs min-h-[38px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="px-5 py-2 rounded-md text-xs font-medium bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition-colors shadow-xs min-h-[38px]"
            >
              {{ loading() ? 'Processando...' : 'Confirmar Pagamento' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PagamentoModalComponent {
  @Input({ required: true }) cobranca!: Cobranca;
  @Output() pago = new EventEmitter<PagamentoResponse>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private financeiroService = inject(FinanceiroService);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    formaPagamento: ['PIX' as FormaPagamento, [Validators.required]],
    valorPago: [0, [Validators.required, Validators.min(0.01)]],
    identificadorTransacao: [''],
    observacao: ['']
  });

  ngOnInit(): void {
    if (this.cobranca) {
      this.form.patchValue({
        valorPago: this.cobranca.valor
      });
    }
  }

  setForma(forma: FormaPagamento): void {
    this.form.patchValue({ formaPagamento: forma });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const val = this.form.value;
    this.financeiroService.quitarCobranca(this.cobranca.id, {
      formaPagamento: val.formaPagamento!,
      valorPago: Number(val.valorPago),
      identificadorTransacao: val.identificadorTransacao || undefined,
      observacao: val.observacao || undefined
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.pago.emit(res);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.detail || err.error?.message || 'Falha ao processar pagamento.');
      }
    });
  }
}
