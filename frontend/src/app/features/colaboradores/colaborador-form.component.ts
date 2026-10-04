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
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative my-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ colaboradorEdicao ? 'Editar Colaborador' : 'Novo Colaborador' }}</h2>
              <p class="text-xs text-slate-400">Gerenciamento de membros da equipe da academia</p>
            </div>
          </div>
          <button (click)="cancelar.emit()" class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        @if (errorMessage()) {
          <div class="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
              <input type="text" formControlName="nome" placeholder="Ex: Roberto Carlos de Oliveira" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>

            @if (!colaboradorEdicao) {
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">CPF (apenas números) *</label>
                <input type="text" formControlName="cpf" maxlength="11" placeholder="Ex: 12345678909" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                @if (form.get('cpf')?.touched && form.get('cpf')?.invalid) {
                  <span class="text-[10px] text-rose-400 mt-1 block">CPF de 11 dígitos obrigatório</span>
                }
              </div>
            }

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">E-mail Corporativo *</label>
              <input type="email" formControlName="email" placeholder="Ex: roberto@fitmanager.com" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp *</label>
              <input type="text" formControlName="telefone" placeholder="Ex: 11988776655" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Cargo / Perfil de Acesso *</label>
              <select formControlName="cargoPerfil" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option value="ROLE_INSTRUTOR">Instrutor (Educador Físico)</option>
                <option value="ROLE_RECEPCIONISTA">Recepcionista</option>
                <option value="ROLE_ADMIN">Administrador</option>
              </select>
            </div>

            @if (form.get('cargoPerfil')?.value === 'ROLE_INSTRUTOR') {
              <div>
                <label class="block text-xs font-semibold text-amber-400 mb-1">Registro CREF * (Conselho Regional)</label>
                <input type="text" formControlName="cref" placeholder="Ex: 123456-G/SP" class="w-full px-4 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400" />
              </div>
            }

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Turno de Trabalho *</label>
              <select formControlName="turno" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="NOITE">Noite</option>
                <option value="INTEGRAL">Integral</option>
              </select>
            </div>

            @if (!colaboradorEdicao) {
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Data de Admissão</label>
                <input type="date" formControlName="dataAdmissao" class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
            }
          </div>

          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800 mt-6">
            <button type="button" (click)="cancelar.emit()" class="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="form.invalid || loading()" class="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center space-x-2">
              @if (loading()) {
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
