import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TreinoService } from '../../core/services/treino.service';
import { AlunoService } from '../../core/services/aluno.service';
import { CriarFichaTreinoRequest, Exercicio } from '../../core/models/treino.models';

@Component({
  selector: 'app-ficha-prescricao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <span class="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">Prescrição Esportiva</span>
        <h2 class="text-xl font-bold text-slate-900 tracking-tight mt-0.5">Nova Ficha de Treino</h2>
        <p class="text-xs text-slate-500 mt-1">Configure o treino do aluno organizado por divisões (A, B, C...)</p>
      </div>

      @if (sucessoMsg()) {
        <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 flex items-center gap-2 shadow-2xs">
          <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="font-medium">{{ sucessoMsg() }}</span>
        </div>
      }

      @if (erroMsg()) {
        <div class="rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-center gap-2 shadow-2xs">
          <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">{{ erroMsg() }}</span>
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Student & General Info -->
        <div class="rounded-xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
            1. Dados Gerais da Prescrição
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">ID do Aluno *</label>
              <input
                type="number"
                formControlName="alunoId"
                placeholder="Ex: 1"
                class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Objetivo do Treino *</label>
              <input
                type="text"
                formControlName="objetivo"
                placeholder="Ex: Hipertrofia Muscular / Perda de Gordura"
                class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Data de Início *</label>
              <input
                type="date"
                formControlName="dataInicio"
                class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Data de Validade (Estimada)</label>
              <input
                type="date"
                formControlName="dataValidade"
                class="w-full rounded-md bg-white border border-slate-300 px-3 py-2 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
              />
            </div>
          </div>
        </div>

        <!-- Divisions (Divisoes de Treino) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Divisões e Exercícios
            </h3>
            <button
              type="button"
              (click)="adicionarDivisao()"
              class="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs min-h-[36px]"
            >
              <svg class="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Divisão
            </button>
          </div>

          <div formArrayName="divisoes" class="space-y-4">
            @for (divCtrl of divisoes.controls; track $index; let divIdx = $index) {
              <div [formGroupName]="divIdx" class="rounded-xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
                <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-md bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                      {{ divCtrl.get('letra')?.value || 'A' }}
                    </span>
                    <input
                      type="text"
                      formControlName="nome"
                      placeholder="Nome da Divisão (Ex: Peito, Tríceps e Ombros)"
                      class="bg-transparent text-slate-900 font-semibold text-sm focus:outline-none border-b border-transparent focus:border-slate-900 px-1 py-0.5"
                    />
                  </div>
                  @if (divisoes.length > 1) {
                    <button
                      type="button"
                      (click)="removerDivisao(divIdx)"
                      class="text-rose-600 hover:text-rose-800 text-xs font-medium"
                    >
                      Remover Divisão
                    </button>
                  }
                </div>

                <!-- Exercises inside this division -->
                <div formArrayName="itens" class="space-y-3 pt-1">
                  @for (itemCtrl of getItens(divIdx).controls; track $index; let itemIdx = $index) {
                    <div [formGroupName]="itemIdx" class="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-mono text-slate-400 font-bold">#{{ itemIdx + 1 }}</span>
                        @if (getItens(divIdx).length > 1) {
                          <button
                            type="button"
                            (click)="removerItem(divIdx, itemIdx)"
                            class="text-rose-600 hover:text-rose-800 text-xs font-medium flex items-center gap-1"
                          >
                            &times; Excluir
                          </button>
                        }
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div class="md:col-span-5">
                          <label class="block text-xs font-medium text-slate-700 mb-1">Exercício *</label>
                          <select
                            formControlName="exercicioId"
                            class="w-full rounded-md bg-white border border-slate-300 px-2.5 py-1.5 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                          >
                            <option [ngValue]="null">Selecione um exercício...</option>
                            @for (ex of catalogoExercicios(); track ex.id) {
                              <option [ngValue]="ex.id">{{ ex.nome }} ({{ ex.grupoMuscular }})</option>
                            }
                          </select>
                        </div>

                        <div class="md:col-span-2">
                          <label class="block text-xs font-medium text-slate-700 mb-1">Séries *</label>
                          <input
                            type="number"
                            formControlName="series"
                            class="w-full rounded-md bg-white border border-slate-300 px-2.5 py-1.5 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                          />
                        </div>

                        <div class="md:col-span-2">
                          <label class="block text-xs font-medium text-slate-700 mb-1">Repetições *</label>
                          <input
                            type="text"
                            formControlName="repeticoes"
                            placeholder="10-12"
                            class="w-full rounded-md bg-white border border-slate-300 px-2.5 py-1.5 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                          />
                        </div>

                        <div class="md:col-span-3">
                          <label class="block text-xs font-medium text-slate-700 mb-1">Carga Inicial (kg) *</label>
                          <input
                            type="number"
                            step="0.5"
                            formControlName="cargaKg"
                            placeholder="0.0"
                            class="w-full rounded-md bg-white border border-slate-300 px-2.5 py-1.5 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                          />
                        </div>

                        <div class="md:col-span-4">
                          <label class="block text-xs font-medium text-slate-700 mb-1">Descanso (segundos) *</label>
                          <input
                            type="number"
                            formControlName="descansoSegundos"
                            class="w-full rounded-md bg-white border border-slate-300 px-2.5 py-1.5 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                          />
                        </div>

                        <div class="md:col-span-8">
                          <label class="block text-xs font-medium text-slate-700 mb-1">Observações da Execução</label>
                          <input
                            type="text"
                            formControlName="observacoes"
                            placeholder="Ex: Drop-set na última série"
                            class="w-full rounded-md bg-white border border-slate-300 px-2.5 py-1.5 text-slate-900 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  }

                  <button
                    type="button"
                    (click)="adicionarItem(divIdx)"
                    class="w-full py-2 rounded-lg border border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium transition-colors flex items-center justify-center gap-1 min-h-[38px]"
                  >
                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Exercício nesta Divisão
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="px-5 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-xs"
          >
            {{ loading() ? 'Prescrevendo...' : 'Salvar e Ativar Ficha' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class FichaPrescricaoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private treinoService = inject(TreinoService);

  catalogoExercicios = this.treinoService.exercicios;
  loading = signal(false);
  sucessoMsg = signal<string | null>(null);
  erroMsg = signal<string | null>(null);

  form = this.fb.group({
    alunoId: [null as number | null, [Validators.required]],
    objetivo: ['Hipertrofia Muscular', [Validators.required]],
    dataInicio: [new Date().toISOString().substring(0, 10), [Validators.required]],
    dataValidade: [new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().substring(0, 10)],
    divisoes: this.fb.array([])
  });

  get divisoes(): FormArray {
    return this.form.get('divisoes') as FormArray;
  }

  getItens(divIdx: number): FormArray {
    return this.divisoes.at(divIdx).get('itens') as FormArray;
  }

  ngOnInit(): void {
    this.treinoService.listarExercicios().subscribe();
    this.adicionarDivisao('A', 'Peito e Tríceps');
  }

  adicionarDivisao(letra?: string, nome?: string): void {
    const defaultLetters = ['A', 'B', 'C', 'D', 'E'];
    const idx = this.divisoes.length;
    const l = letra || defaultLetters[idx] || `D${idx + 1}`;
    const n = nome || `Divisão ${l}`;

    const divGroup = this.fb.group({
      letra: [l, Validators.required],
      nome: [n, Validators.required],
      ordem: [idx + 1],
      itens: this.fb.array([])
    });

    this.divisoes.push(divGroup);
    this.adicionarItem(idx);
  }

  removerDivisao(index: number): void {
    this.divisoes.removeAt(index);
  }

  adicionarItem(divIdx: number): void {
    const itens = this.getItens(divIdx);
    const itemGroup = this.fb.group({
      exercicioId: [null as number | null, Validators.required],
      ordemExecucao: [itens.length + 1],
      series: [4, [Validators.required, Validators.min(1)]],
      repeticoes: ['10-12', Validators.required],
      cargaKg: [0.0, [Validators.required, Validators.min(0)]],
      descansoSegundos: [60, [Validators.required, Validators.min(1)]],
      observacoes: ['']
    });
    itens.push(itemGroup);
  }

  removerItem(divIdx: number, itemIdx: number): void {
    this.getItens(divIdx).removeAt(itemIdx);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.sucessoMsg.set(null);
    this.erroMsg.set(null);

    const val = this.form.value;
    const request: CriarFichaTreinoRequest = {
      alunoId: Number(val.alunoId),
      objetivo: val.objetivo!,
      dataInicio: val.dataInicio!,
      dataValidade: val.dataValidade || undefined,
      divisoes: (val.divisoes as any[]).map((d, dIdx) => ({
        letra: d.letra,
        nome: d.nome,
        ordem: dIdx + 1,
        itens: d.itens.map((i: any, iIdx: number) => ({
          exercicioId: Number(i.exercicioId),
          ordemExecucao: iIdx + 1,
          series: Number(i.series),
          repeticoes: i.repeticoes,
          cargaKg: Number(i.cargaKg),
          descansoSegundos: Number(i.descansoSegundos),
          observacoes: i.observacoes || undefined
        }))
      }))
    };

    this.treinoService.prescreverFicha(request).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.sucessoMsg.set(`Ficha #${res.id} criada com sucesso para ${res.alunoNome}! Ficha anterior arquivada.`);
      },
      error: (err) => {
        this.loading.set(false);
        this.erroMsg.set(err.error?.detail || err.error?.message || 'Falha ao prescrever ficha.');
      }
    });
  }
}
