import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plano } from '../../core/models/plano.models';
import { MatriculaService } from '../../core/services/matricula.service';

@Component({
  selector: 'app-matricula-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [':host { display: block; }'],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 shadow-xl relative space-y-4 animate-fade-in">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Efetivar Matrícula</h3>
              <p class="text-xs text-slate-500">{{ plano.nome }}</p>
            </div>
          </div>
          <button (click)="cancelar.emit()" class="text-slate-400 hover:text-slate-600 p-1 rounded-md text-xl leading-none font-bold">
            &times;
          </button>
        </div>

        <div class="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Periodicidade:</span>
            <span class="font-semibold text-slate-900">{{ plano.periodicidade }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Mensalidade:</span>
            <span class="font-bold text-slate-900">R$ {{ plano.valorMensalidade | number:'1.2-2' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Geração de Faturas:</span>
            <span class="text-slate-700">Automática na contratação</span>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
            <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">ID do Aluno *</label>
            <input
              type="number"
              formControlName="alunoId"
              placeholder="Ex: 15"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Data de Início da Vigência *</label>
            <input
              type="date"
              formControlName="dataInicio"
              class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              (click)="cancelar.emit()"
              class="px-4 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs min-h-[38px]"
            >
              Voltar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium rounded-md text-xs flex items-center gap-2 shadow-xs min-h-[38px]"
            >
              @if (loading()) {
                <span class="inline-block animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Confirmando...</span>
              } @else {
                <span>Confirmar Matrícula</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MatriculaModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly matriculaService = inject(MatriculaService);

  @Input({ required: true }) plano!: Plano;
  @Input() alunoIdPadrao?: number;
  @Output() concluido = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    alunoId: [this.alunoIdPadrao || '', [Validators.required]],
    dataInicio: [new Date().toISOString().substring(0, 10), [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const { alunoId, dataInicio } = this.form.value;

    this.matriculaService.matricular({
      alunoId: Number(alunoId),
      planoId: this.plano.id,
      dataInicio: dataInicio!
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.concluido.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.detail || 'Erro ao efetivar matrícula.');
      }
    });
  }
}
