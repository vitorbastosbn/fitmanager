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
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div class="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h3 class="text-xl font-bold text-white">Quitar Cobrança</h3>
            <p class="text-sm text-neutral-400">Fatura #{{ cobranca.id }} - {{ cobranca.alunoNome }}</p>
          </div>
          <button (click)="close.emit()" class="text-neutral-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        @if (errorMessage()) {
          <div class="mt-4 rounded-xl bg-red-950/50 border border-red-800/80 p-3 text-sm text-red-300">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mt-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Valor Original: R$ {{ cobranca.valor.toFixed(2) }}
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-neutral-500 font-medium">R$</span>
              <input
                type="number"
                step="0.01"
                formControlName="valorPago"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 pl-10 pr-4 py-2.5 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Forma de Pagamento *
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                (click)="setForma('PIX')"
                [class]="form.value.formaPagamento === 'PIX' ? 'bg-amber-500 text-black font-semibold' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'"
                class="py-2.5 rounded-xl text-sm transition-colors text-center"
              >
                PIX
              </button>
              <button
                type="button"
                (click)="setForma('CARTAO_CREDITO')"
                [class]="form.value.formaPagamento === 'CARTAO_CREDITO' ? 'bg-amber-500 text-black font-semibold' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'"
                class="py-2.5 rounded-xl text-sm transition-colors text-center"
              >
                Crédito
              </button>
              <button
                type="button"
                (click)="setForma('CARTAO_DEBITO')"
                [class]="form.value.formaPagamento === 'CARTAO_DEBITO' ? 'bg-amber-500 text-black font-semibold' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'"
                class="py-2.5 rounded-xl text-sm transition-colors text-center"
              >
                Débito
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Identificador da Transação (Opcional)
            </label>
            <input
                type="text"
                formControlName="identificadorTransacao"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                placeholder="Ex: NSU / Código PIX E2E"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Observação (Opcional)
            </label>
            <textarea
                rows="2"
                formControlName="observacao"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                placeholder="Observações do atendente"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black transition-colors"
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
