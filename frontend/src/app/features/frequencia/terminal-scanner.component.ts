import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrequenciaService } from '../../core/services/frequencia.service';
import { CheckInResponse } from '../../core/models/frequencia.models';

@Component({
  selector: 'app-terminal-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto p-2 sm:p-4">
      <!-- Header -->
      <div class="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <span class="text-[11px] uppercase font-bold tracking-wider text-slate-400">Controle de Portaria & Acesso</span>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">Terminal de Check-in</h2>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="text-xs font-medium text-slate-600">Scanner Ativo</span>
        </div>
      </div>

      <!-- Scanner Input Box -->
      <div class="rounded-xl bg-white border border-slate-200 p-6 shadow-xs space-y-3">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Entrada do Scanner / Token QR Code
        </label>
        <div class="flex gap-2 sm:gap-3">
          <input
            #tokenInput
            type="text"
            [(ngModel)]="tokenValue"
            (keyup.enter)="processarCheckIn()"
            placeholder="Aponte o leitor de QR Code ou digite o token..."
            class="flex-1 rounded-lg bg-white border border-slate-300 px-4 py-2.5 text-slate-900 font-mono text-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
            [disabled]="loading()"
          />
          <button
            (click)="processarCheckIn()"
            [disabled]="loading() || !tokenValue.trim()"
            class="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-xs flex items-center gap-1.5"
          >
            {{ loading() ? 'Validando...' : 'Validar' }}
          </button>
        </div>
        <p class="text-xs text-slate-400">
          Compatível com leitores ópticos USB standard (envio automático com tecla Enter) e digitação manual.
        </p>
      </div>

      <!-- Feedback Banner (Instant Green/Red result) -->
      @if (resultado()) {
        @if (resultado()!.status === 'LIBERADO') {
          <div class="rounded-xl bg-emerald-50 border border-emerald-200 p-6 shadow-xs flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 text-2xl font-bold shrink-0">
              ✓
            </div>
            <div class="space-y-0.5">
              <span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Acesso Autorizado
              </span>
              <h3 class="text-xl font-bold text-slate-900">{{ resultado()!.alunoNome }}</h3>
              <p class="text-xs text-emerald-800 font-medium">{{ resultado()!.planoNome }}</p>
              <p class="text-xs text-slate-600 mt-1">{{ resultado()!.mensagem }}</p>
            </div>
          </div>
        } @else {
          <div class="rounded-xl bg-rose-50 border border-rose-200 p-6 shadow-xs flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 text-2xl font-bold shrink-0">
              ✕
            </div>
            <div class="space-y-0.5">
              <span class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                Acesso Bloqueado
              </span>
              <h3 class="text-xl font-bold text-slate-900">{{ resultado()!.alunoNome || 'Aluno' }}</h3>
              <p class="text-xs font-semibold text-rose-700 font-mono">{{ resultado()!.motivo }}</p>
              <p class="text-xs text-slate-600 mt-1">{{ resultado()!.mensagem }}</p>
            </div>
          </div>
        }
      }

      @if (erroGrave()) {
        <div class="rounded-lg bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 flex items-center justify-between">
          <span>{{ erroGrave() }}</span>
          <button (click)="erroGrave.set(null)" class="text-rose-500 hover:text-rose-800 text-base">&times;</button>
        </div>
      }

      <!-- Today's Access Log -->
      <div class="space-y-3 pt-2">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-slate-900">Frequência Registrada Hoje</h3>
          <button
            (click)="carregarHoje()"
            class="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Atualizar Lista
          </button>
        </div>

        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table class="w-full text-left text-sm text-slate-700">
            <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th class="px-5 py-3">Horário</th>
                <th class="px-5 py-3">Aluno</th>
                <th class="px-5 py-3">Status</th>
                <th class="px-5 py-3">Motivo / Obs</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (item of frequenciaService.checkInsHoje(); track item.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-5 py-3 font-mono text-xs text-slate-500">{{ formatarHorario(item.dataHora) }}</td>
                  <td class="px-5 py-3 font-semibold text-slate-900">{{ item.alunoNome }}</td>
                  <td class="px-5 py-3">
                    @if (item.status === 'LIBERADO') {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Liberado
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                        Bloqueado
                      </span>
                    }
                  </td>
                  <td class="px-5 py-3 text-xs text-slate-500 font-mono">
                    {{ item.motivoBloqueio || '-' }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-5 py-8 text-center text-slate-400 text-xs">
                    Nenhum check-in registrado na catraca até o momento no dia de hoje.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class TerminalScannerComponent implements OnInit {
  frequenciaService = inject(FrequenciaService);

  tokenValue = '';
  loading = signal(false);
  resultado = signal<CheckInResponse | null>(null);
  erroGrave = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarHoje();
  }

  carregarHoje(): void {
    this.frequenciaService.listarCheckInsHoje().subscribe();
  }

  processarCheckIn(): void {
    const token = this.tokenValue.trim();
    if (!token) return;

    this.loading.set(true);
    this.erroGrave.set(null);
    this.resultado.set(null);

    this.frequenciaService.registrarCheckIn({ token }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.resultado.set(res);
        this.tokenValue = '';
        this.carregarHoje();
      },
      error: (err) => {
        this.loading.set(false);
        // If HTTP 422: it's a BLOQUEADO result with structured payload
        if (err.status === 422 && err.error?.status === 'BLOQUEADO') {
          this.resultado.set(err.error);
          this.carregarHoje();
        } else {
          this.erroGrave.set(err.error?.detail || err.error?.message || 'Erro ao processar leitura do QR Code.');
        }
        this.tokenValue = '';
      }
    });
  }

  formatarHorario(isoString: string): string {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  }
}
