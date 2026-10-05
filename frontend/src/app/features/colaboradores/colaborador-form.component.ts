import { Component, EventEmitter, Input, Output, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Colaborador, ColaboradorCreate, ColaboradorUpdate } from '../../core/models/colaborador.models';
import { ColaboradorService } from '../../core/services/colaborador.service';

@Component({
  selector: 'app-colaborador-form',
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">{{ colaboradorEdicao ? 'Editar Colaborador' : 'Novo Colaborador' }}</h2>
              <p class="text-xs text-slate-500">Cadastro e dados profissionais da equipe</p>
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
              <input type="text" formControlName="nome" placeholder="Ex: Roberto Carlos de Oliveira" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>

            @if (!colaboradorEdicao) {
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">CPF (apenas números) *</label>
                <input type="text" formControlName="cpf" maxlength="11" placeholder="Ex: 12345678909" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
                @if (form.get('cpf')?.touched && form.get('cpf')?.invalid) {
                  <span class="text-[10px] text-rose-600 mt-1 block">CPF de 11 dígitos obrigatório</span>
                }
              </div>
            }

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">E-mail Corporativo *</label>
              <input type="email" formControlName="email" placeholder="Ex: roberto@fitmanager.com" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
              <input type="text" formControlName="telefone" placeholder="Ex: 11988776655" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Cargo / Perfil de Acesso *</label>
              <select formControlName="cargoPerfil" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs">
                <option value="ROLE_INSTRUTOR">Instrutor (Educador Físico)</option>
                <option value="ROLE_RECEPCIONISTA">Recepcionista</option>
                <option value="ROLE_ADMIN">Administrador</option>
              </select>
            </div>

            @if (form.get('cargoPerfil')?.value === 'ROLE_INSTRUTOR') {
              <div>
                <label class="block text-xs font-semibold text-amber-700 mb-1">Registro CREF * (Conselho Regional)</label>
                <input type="text" formControlName="cref" placeholder="Ex: 123456-G/SP" class="w-full px-3 py-2 bg-white border border-amber-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 shadow-2xs" />
              </div>
            }

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Turno de Trabalho *</label>
              <select formControlName="turno" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs">
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="NOITE">Noite</option>
                <option value="INTEGRAL">Integral</option>
              </select>
            </div>

            @if (!colaboradorEdicao) {
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Data de Admissão</label>
                <input type="date" formControlName="dataAdmissao" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" />
              </div>
            }
          </div>

          <div class="flex items-center justify-end space-x-2 pt-5 border-t border-slate-100 mt-5">
            <button type="button" (click)="cancelar.emit()" class="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.invalid || loading()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium rounded-md text-xs transition-colors shadow-xs flex items-center space-x-2">
              @if (loading()) {
                <svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Salvando...</span>
              } @else {
                <span>{{ colaboradorEdicao ? 'Salvar Alterações' : 'Cadastrar Colaborador' }}</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ColaboradorFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly colaboradorService = inject(ColaboradorService);

  @Input() colaboradorEdicao?: Colaborador;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    cargoPerfil: ['ROLE_INSTRUTOR', [Validators.required]],
    cref: [''],
    turno: ['INTEGRAL', [Validators.required]],
    dataAdmissao: [new Date().toISOString().split('T')[0]]
  });

  ngOnInit(): void {
    if (this.colaboradorEdicao) {
      this.form.patchValue({
        nome: this.colaboradorEdicao.nome,
        email: this.colaboradorEdicao.email,
        telefone: this.colaboradorEdicao.telefone,
        cargoPerfil: this.colaboradorEdicao.cargoPerfil,
        cref: this.colaboradorEdicao.cref || '',
        turno: this.colaboradorEdicao.turno
      });
      this.form.get('cpf')?.clearValidators();
      this.form.get('cpf')?.updateValueAndValidity();
    } else {
      this.form.get('cpf')?.setValidators([Validators.required, Validators.pattern(/^\d{11}$/)]);
      this.form.get('cpf')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    if (val.cargoPerfil === 'ROLE_INSTRUTOR' && (!val.cref || !val.cref.trim())) {
      this.errorMessage.set('O CREF é obrigatório para colaboradores com perfil de Instrutor.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    if (this.colaboradorEdicao) {
      const payload: ColaboradorUpdate = {
        nome: val.nome!,
        email: val.email!,
        telefone: val.telefone!,
        cargoPerfil: val.cargoPerfil as any,
        cref: val.cref || undefined,
        turno: val.turno as any
      };

      this.colaboradorService.atualizar(this.colaboradorEdicao.id, payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.salvo.emit();
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.detail || err.error?.message || 'Falha ao atualizar colaborador.');
        }
      });
    } else {
      const payload: ColaboradorCreate = {
        nome: val.nome!,
        cpf: val.cpf!,
        email: val.email!,
        telefone: val.telefone!,
        cargoPerfil: val.cargoPerfil as any,
        cref: val.cref || undefined,
        turno: val.turno as any,
        dataAdmissao: val.dataAdmissao || undefined
      };

      this.colaboradorService.cadastrar(payload).subscribe({
        next: () => {
          this.loading.set(false);
          this.salvo.emit();
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.detail || err.error?.message || 'Falha ao cadastrar colaborador.');
        }
      });
    }
  }
}
