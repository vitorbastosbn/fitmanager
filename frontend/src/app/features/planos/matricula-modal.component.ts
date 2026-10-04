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
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Efetivar Matrícula</h3>
              <p class="text-xs text-slate-400">{{ plano.nome }}</p>
            </div>
          </div>
          <button (click)="cancelar.emit()" class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl mb-6 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Periodicidade:</span>
            <span class="font-bold text-white">{{ plano.periodicidade }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Mensalidade:</span>
            <span class="font-bold text-emerald-400">R$ {{ plano.valorMensalidade | number:'1.2-2' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Geração de Faturas:</span>
            <span class="text-slate-300">Automática na contratação</span>
          </div>
        </div>

        @if (errorMessage()) {
          <div class="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">ID do Aluno *</label>
            <input
              type="number"
              formControlName="alunoId"
              placeholder="Ex: 15"
              class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Data de Início da Vigência *</label>
            <input
              type="date"
              formControlName="dataInicio"
              class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" (click)="cancelar.emit()" class="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800">
              Voltar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2"
            >
              @if (loading()) {
                <span class="inline-block animate-spin w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
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
