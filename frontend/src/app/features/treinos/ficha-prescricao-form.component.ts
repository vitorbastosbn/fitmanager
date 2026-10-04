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
    <div class="max-w-4xl mx-auto p-4 space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-amber-500">Prescrição Esportiva</span>
          <h2 class="text-2xl font-black text-white tracking-tight">Nova Ficha de Treino</h2>
          <p class="text-xs text-neutral-400 mt-1">Configure o treino do aluno organizado por divisões (A, B, C...)</p>
        </div>
      </div>

      @if (sucessoMsg()) {
        <div class="rounded-2xl bg-emerald-950/70 border border-emerald-800 p-4 text-sm text-emerald-300">
          {{ sucessoMsg() }}
        </div>
      }

      @if (erroMsg()) {
        <div class="rounded-2xl bg-red-950/70 border border-red-800 p-4 text-sm text-red-300">
          {{ erroMsg() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Student & General Info -->
        <div class="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-300 border-b border-neutral-800 pb-2">
            1. Dados Gerais da Prescrição
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-400 mb-1">ID do Aluno *</label>
              <input
                type="number"
                formControlName="alunoId"
                placeholder="Ex: 1"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-400 mb-1">Objetivo do Treino *</label>
              <input
                type="text"
                formControlName="objetivo"
                placeholder="Ex: Hipertrofia Muscular / Perda de Gordura"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-400 mb-1">Data de Início *</label>
              <input
                type="date"
                formControlName="dataInicio"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-400 mb-1">Data de Validade (Estimada)</label>
              <input
                type="date"
                formControlName="dataValidade"
                class="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Divisions (Divisoes de Treino) -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold uppercase tracking-wider text-neutral-300">
              2. Divisões e Exercícios
            </h3>
            <button
              type="button"
              (click)="adicionarDivisao()"
              class="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              + Adicionar Divisão (A, B, C...)
            </button>
          </div>

          <div formArrayName="divisoes" class="space-y-6">
            @for (divCtrl of divisoes.controls; track $index; let divIdx = $index) {
              <div [formGroupName]="divIdx" class="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-4">
                <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center text-sm">
                      {{ divCtrl.get('letra')?.value || 'A' }}
                    </span>
                    <input
                      type="text"
                      formControlName="nome"
                      placeholder="Nome da Divisão (Ex: Peito, Tríceps e Ombros)"
                      class="bg-transparent text-white font-bold text-base focus:outline-none border-b border-neutral-700 focus:border-amber-500 px-1 py-0.5"
                    />
                  </div>
                  @if (divisoes.length > 1) {
                    <button
                      type="button"
                      (click)="removerDivisao(divIdx)"
                      class="text-neutral-500 hover:text-red-400 text-xs font-semibold"
                    >
                      Remover Divisão
                    </button>
                  }
                </div>

                <!-- Exercises inside this division -->
                <div formArrayName="itens" class="space-y-3 pt-2">
                  @for (itemCtrl of getItens(divIdx).controls; track $index; let itemIdx = $index) {
                    <div [formGroupName]="itemIdx" class="rounded-2xl bg-neutral-950 border border-neutral-800 p-4 space-y-3">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-mono text-neutral-500 font-bold">#{{ itemIdx + 1 }}</span>
                        @if (getItens(divIdx).length > 1) {
                          <button
                            type="button"
                            (click)="removerItem(divIdx, itemIdx)"
                            class="text-neutral-500 hover:text-red-400 text-xs"
                          >
                            &times; Excluir
                          </button>
                        }
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div class="md:col-span-5">
                          <label class="block text-xs font-semibold text-neutral-400 mb-1">Exercício do Catálogo *</label>
                          <select
                            formControlName="exercicioId"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                          >
                            <option [ngValue]="null">Selecione um exercício...</option>
                            @for (ex of catalogoExercicios(); track ex.id) {
                              <option [ngValue]="ex.id">{{ ex.nome }} ({{ ex.grupoMuscular }})</option>
                            }
                          </select>
                        </div>

                        <div class="md:col-span-2">
                          <label class="block text-xs font-semibold text-neutral-400 mb-1">Séries *</label>
                          <input
                            type="number"
                            formControlName="series"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div class="md:col-span-2">
                          <label class="block text-xs font-semibold text-neutral-400 mb-1">Repetições *</label>
                          <input
                            type="text"
                            formControlName="repeticoes"
                            placeholder="10-12"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div class="md:col-span-3">
                          <label class="block text-xs font-semibold text-neutral-400 mb-1">Carga Inicial (kg) *</label>
                          <input
                            type="number"
                            step="0.5"
                            formControlName="cargaKg"
                            placeholder="0.0"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div class="md:col-span-4">
                          <label class="block text-xs font-semibold text-neutral-400 mb-1">Descanso (segundos) *</label>
                          <input
                            type="number"
                            formControlName="descansoSegundos"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        <div class="md:col-span-8">
                          <label class="block text-xs font-semibold text-neutral-400 mb-1">Observações da Execução</label>
                          <input
                            type="text"
                            formControlName="observacoes"
                            placeholder="Ex: Drop-set na última série"
                            class="w-full rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  }

                  <button
                    type="button"
                    (click)="adicionarItem(divIdx)"
                    class="w-full py-2.5 rounded-xl border border-dashed border-neutral-700 hover:border-amber-500 text-neutral-400 hover:text-amber-400 text-xs font-semibold transition-colors"
                  >
                    + Adicionar Exercício nesta Divisão
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-sm transition-colors shadow-lg shadow-amber-500/10"
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
