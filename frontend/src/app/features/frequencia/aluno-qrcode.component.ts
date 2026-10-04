import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequenciaService } from '../../core/services/frequencia.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-aluno-qrcode',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto">
      <div class="w-full rounded-3xl bg-neutral-900 border border-neutral-800 p-8 shadow-2xl relative overflow-hidden">
        <!-- Glow indicator -->
        <div class="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Acesso à Academia
          </span>
          <h2 class="mt-2 text-xl font-bold text-white tracking-tight">QR Code de Check-in</h2>
          <p class="text-xs text-neutral-400 mt-1">Aproxime este código do leitor na recepção</p>
        </div>

        <!-- QR Code Canvas/Image Container with high-contrast white background for scanner read -->
        <div class="relative mx-auto my-6 flex items-center justify-center p-4 bg-white rounded-2xl shadow-inner w-56 h-56">
          @if (qrCodeDataUrl()) {
            <img [src]="qrCodeDataUrl()" alt="QR Code de Check-in" class="w-48 h-48 object-contain" />
          } @else {
            <div class="flex flex-col items-center justify-center text-neutral-500 text-xs">
              <svg class="animate-spin h-6 w-6 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Gerando código...</span>
            </div>
          }
        </div>

        <!-- Timer & Countdown bar -->
        <div class="space-y-2 mt-4">
          <div class="flex items-center justify-between text-xs font-medium">
            <span class="text-neutral-400">Expira em:</span>
            <span class="font-mono text-amber-400 font-bold">{{ tempoRestante() }}s</span>
          </div>

          <div class="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div
              class="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
              [style.width.%]="(tempoRestante() / 60) * 100"
            ></div>
          </div>
        </div>

        <button
          (click)="gerarNovoToken()"
          [disabled]="loading()"
          class="mt-6 w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ loading() ? 'Atualizando...' : 'Atualizar Código Agora' }}
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
