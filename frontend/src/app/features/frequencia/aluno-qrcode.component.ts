import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequenciaService } from '../../core/services/frequencia.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-aluno-qrcode',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-4 text-center max-w-sm mx-auto">
      <div class="w-full rounded-xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs relative">
        <div class="mb-4">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Acesso à Academia
          </span>
          <h2 class="mt-2 text-lg font-bold text-slate-900 tracking-tight">QR Code de Check-in</h2>
          <p class="text-xs text-slate-500 mt-0.5">Aproxime este código do leitor na recepção</p>
        </div>

        <!-- QR Code Canvas/Image Container with high-contrast white background for scanner read -->
        <div class="relative mx-auto my-5 flex items-center justify-center p-3 bg-white border border-slate-200 rounded-lg shadow-2xs w-56 h-56">
          @if (qrCodeDataUrl()) {
            <img [src]="qrCodeDataUrl()" alt="QR Code de Check-in" class="w-48 h-48 object-contain" />
          } @else {
            <div class="flex flex-col items-center justify-center text-slate-400 text-xs">
              <svg class="animate-spin h-6 w-6 text-slate-700 mb-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Gerando código...</span>
            </div>
          }
        </div>

        <!-- Timer & Countdown bar -->
        <div class="space-y-1.5 mt-3">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-500">Expira em:</span>
            <span class="font-mono text-slate-900 font-bold">{{ tempoRestante() }}s</span>
          </div>

          <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              class="bg-slate-900 h-full transition-all duration-1000 ease-linear rounded-full"
              [style.width.%]="(tempoRestante() / 60) * 100"
            ></div>
          </div>
        </div>

        <button
          (click)="gerarNovoToken()"
          [disabled]="loading()"
          class="mt-5 w-full py-2 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading() ? 'Atualizando...' : 'Atualizar Código' }}
        </button>
      </div>
    </div>
  `
})
export class AlunoQrCodeComponent implements OnInit, OnDestroy {
  private frequenciaService = inject(FrequenciaService);

  qrCodeDataUrl = signal<string | null>(null);
  tempoRestante = signal<number>(60);
  loading = signal<boolean>(false);

  private timerInterval: any = null;

  ngOnInit(): void {
    this.gerarNovoToken();
  }

  ngOnDestroy(): void {
    this.pararTimer();
  }

  gerarNovoToken(): void {
    this.loading.set(true);
    this.frequenciaService.gerarTokenQrCode().subscribe({
      next: async (res) => {
        try {
          const dataUrl = await QRCode.toDataURL(res.token, {
            width: 256,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
          this.qrCodeDataUrl.set(dataUrl);
          this.iniciarTimer(res.segundosValidade || 60);
        } catch (e) {
          console.error('Erro ao renderizar QRCode:', e);
        } finally {
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Falha ao gerar token de QR Code:', err);
        this.loading.set(false);
      }
    });
  }

  private iniciarTimer(segundos: number): void {
    this.pararTimer();
    this.tempoRestante.set(segundos);

    this.timerInterval = setInterval(() => {
      const atual = this.tempoRestante();
      if (atual <= 1) {
        this.pararTimer();
        this.gerarNovoToken();
      } else {
        this.tempoRestante.set(atual - 1);
      }
    }, 1000);
  }

  private pararTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
