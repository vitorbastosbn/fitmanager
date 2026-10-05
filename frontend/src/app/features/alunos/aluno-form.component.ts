import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Aluno, AlunoCreate } from '../../core/models/aluno.models';
import { AlunoService } from '../../core/services/aluno.service';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [':host { display: block; }'],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white border border-slate-200 rounded-xl w-full max-w-xl p-6 sm:p-7 shadow-xl relative my-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">{{ alunoEdicao ? 'Editar Aluno' : 'Novo Aluno' }}</h2>
              <p class="text-xs text-slate-500">Dados cadastrais, contato e endereço residencial</p>
            </div>
          </div>
          <button (click)="cancelar.emit()" class="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (errorMessage()) {
          <div class="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
              <input type="text" formControlName="nome" placeholder="Ex: Mariana Silva Oliveira" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">CPF (apenas números) *</label>
              <input type="text" formControlName="cpf" maxlength="11" placeholder="Ex: 12345678909" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
              @if (form.get('cpf')?.touched && form.get('cpf')?.invalid) {
                <span class="text-[10px] text-rose-600 mt-1 block">CPF de 11 dígitos obrigatório</span>
              }
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Data de Nascimento *</label>
              <input type="date" formControlName="dataNascimento" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
              <input type="text" formControlName="telefone" placeholder="Ex: 11987654321" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
              <input type="email" formControlName="email" placeholder="mariana@email.com" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Endereço Residencial</h3>
            <div formGroupName="endereco" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 mb-1">Logradouro</label>
                <input type="text" formControlName="logradouro" placeholder="Rua / Av" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Número</label>
                <input type="text" formControlName="numero" placeholder="100" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Bairro</label>
                <input type="text" formControlName="bairro" placeholder="Centro" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Cidade</label>
                <input type="text" formControlName="cidade" placeholder="São Paulo" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">UF</label>
                <input type="text" formControlName="estado" maxlength="2" placeholder="SP" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs uppercase" />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-5">
            <button type="button" (click)="cancelar.emit()" class="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="form.invalid || loading()"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium rounded-md text-xs transition-colors shadow-xs flex items-center space-x-2"
            >
              @if (loading()) {
                <span class="inline-block animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Salvando...</span>
              } @else {
                <span>{{ alunoEdicao ? 'Atualizar Aluno' : 'Salvar e Gerar Acesso' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AlunoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly alunoService = inject(AlunoService);

  @Input() alunoEdicao: Aluno | null = null;
  @Output() salvo = new EventEmitter<Aluno>();
  @Output() cancelar = new EventEmitter<void>();

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    nome: ['', [Validators.required]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    dataNascimento: ['', [Validators.required]],
    telefone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    endereco: this.fb.group({
      logradouro: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: ['']
    })
  });

  ngOnInit(): void {
    if (this.alunoEdicao) {
      this.form.patchValue({
        nome: this.alunoEdicao.nome,
        cpf: this.alunoEdicao.cpf,
        dataNascimento: this.alunoEdicao.dataNascimento,
        telefone: this.alunoEdicao.telefone,
        email: this.alunoEdicao.email,
        endereco: {
          logradouro: this.alunoEdicao.endereco?.logradouro || '',
          numero: this.alunoEdicao.endereco?.numero || '',
          bairro: this.alunoEdicao.endereco?.bairro || '',
          cidade: this.alunoEdicao.endereco?.cidade || '',
          estado: this.alunoEdicao.endereco?.estado || '',
          cep: this.alunoEdicao.endereco?.cep || ''
        }
      });
      this.form.get('cpf')?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const rawValue = this.form.getRawValue();

    if (this.alunoEdicao) {
      this.alunoService.atualizar(this.alunoEdicao.id, rawValue as any).subscribe({
        next: (alunoAtualizado) => {
          this.loading.set(false);
          this.salvo.emit(alunoAtualizado);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.detail || 'Erro ao atualizar aluno.');
        }
      });
    } else {
      this.alunoService.cadastrar(rawValue as AlunoCreate).subscribe({
        next: (novoAluno) => {
          this.loading.set(false);
          this.salvo.emit(novoAluno);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.detail || 'Erro ao cadastrar aluno.');
        }
      });
    }
  }
}
