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
    <div class="space-y-8 max-w-4xl mx-auto p-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-amber-500">Controle de Portaria</span>
          <h2 class="text-2xl font-black text-white tracking-tight">Terminal de Check-in</h2>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="text-xs font-semibold text-neutral-400">Scanner Ativo</span>
        </div>
      </div>

      <!-- Scanner Input Box -->
      <div class="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Entrada do Scanner / Token QR Code
        </label>
        <div class="flex gap-3">
          <input
            #tokenInput
            type="text"
            [(ngModel)]="tokenValue"
            (keyup.enter)="processarCheckIn()"
            placeholder="Aponte o leitor de QR Code ou cole o token..."
            class="flex-1 rounded-2xl bg-neutral-950 border border-neutral-800 px-5 py-3.5 text-white font-mono text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            [disabled]="loading()"
          />
          <button
            (click)="processarCheckIn()"
            [disabled]="loading() || !tokenValue.trim()"
            class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold text-sm transition-colors flex items-center gap-2"
          >
            {{ loading() ? 'Validando...' : 'Liberar' }}
          </button>
        </div>
        <p class="text-xs text-neutral-500">
          Suporta leitores ópticos USB standard (envio automático ao ler) e digitação manual.
        </p>
      </div>

      <!-- Feedback Banner (Instant Green/Red result) -->
      @if (resultado()) {
        @if (resultado()!.status === 'LIBERADO') {
          <div class="rounded-3xl bg-emerald-950/80 border-2 border-emerald-500/80 p-8 shadow-2xl shadow-emerald-900/30 flex items-start gap-6 animate-fade-in">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl font-black shrink-0">
              ✓
            </div>
            <div class="space-y-1">
              <span class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-black">
                Acesso Liberado
              </span>
              <h3 class="text-2xl font-bold text-white">{{ resultado()!.alunoNome }}</h3>
              <p class="text-sm text-emerald-300 font-medium">{{ resultado()!.planoNome }}</p>
              <p class="text-xs text-neutral-400 mt-2">{{ resultado()!.mensagem }}</p>
            </div>
          </div>
        } @else {
          <div class="rounded-3xl bg-red-950/80 border-2 border-red-500/80 p-8 shadow-2xl shadow-red-900/30 flex items-start gap-6 animate-fade-in">
            <div class="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-3xl font-black shrink-0">
              ✕
            </div>
            <div class="space-y-1">
              <span class="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500 text-white">
                Acesso Bloqueado
              </span>
              <h3 class="text-2xl font-bold text-white">{{ resultado()!.alunoNome || 'Aluno' }}</h3>
              <p class="text-sm font-semibold text-red-300 font-mono">{{ resultado()!.motivo }}</p>
              <p class="text-xs text-red-200 mt-2">{{ resultado()!.mensagem }}</p>
            </div>
          </div>
        }
      }

      @if (erroGrave()) {
        <div class="rounded-2xl bg-red-950/60 border border-red-800 p-4 text-sm text-red-300 flex items-center justify-between">
          <span>{{ erroGrave() }}</span>
          <button (click)="erroGrave.set(null)" class="text-red-400 hover:text-white">&times;</button>
        </div>
      }

      <!-- Today's Access Log -->
      <div class="space-y-4 pt-4 border-t border-neutral-800">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-white">Frequência Registrada Hoje</h3>
          <button
            (click)="carregarHoje()"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
          >
            Atualizar Lista
          </button>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <table class="w-full text-left text-sm text-neutral-300">
            <thead class="bg-neutral-950/80 text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              <tr>
                <th class="px-6 py-4">Horário</th>
                <th class="px-6 py-4">Aluno</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Motivo / Obs</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800">
              @for (item of frequenciaService.checkInsHoje(); track item.id) {
                <tr class="hover:bg-neutral-800/40 transition-colors">
                  <td class="px-6 py-4 font-mono text-xs text-neutral-400">{{ formatarHorario(item.dataHora) }}</td>
                  <td class="px-6 py-4 font-medium text-white">{{ item.alunoNome }}</td>
                  <td class="px-6 py-4">
                    @if (item.status === 'LIBERADO') {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                        Liberado
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/80 text-red-400 border border-red-800/60">
                        Bloqueado
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 text-xs text-neutral-400 font-mono">
                    {{ item.motivoBloqueio || '-' }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-8 text-center text-neutral-500">
                    Nenhum check-in registrado no dia de hoje até o momento.
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
