import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LgpdService } from '../../core/services/lgpd.service';
import { AuthService } from '../../core/services/auth.service';
import { TermoVigente } from '../../core/models/lgpd.models';
import { MascararCpfPipe } from '../../shared/pipes/mascarar-cpf.pipe';

@Component({
  selector: 'app-privacidade-painel',
  standalone: true,
  imports: [CommonModule, FormsModule, MascararCpfPipe],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto animate-fade-in p-4 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Lei 13.709/2018 (LGPD)
            </span>
            <span class="text-xs text-slate-500">Direitos do Titular & Governança</span>
          </div>
          <h1 class="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Privacidade & Proteção de Dados
          </h1>
          <p class="text-xs text-slate-500 mt-1 max-w-2xl">
            Gerencie o tratamento dos seus dados pessoais, solicite portabilidade digital em JSON ou exerça seu direito à anonimização cadastral.
          </p>
        </div>
      </div>

      <!-- Alert Messages -->
      @if (mensagemSucesso()) {
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-medium">{{ mensagemSucesso() }}</span>
          </div>
          <button (click)="mensagemSucesso.set(null)" class="text-emerald-700 hover:text-emerald-900 font-bold p-1">&times;</button>
        </div>
      }

      @if (mensagemErro()) {
        <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center justify-between shadow-2xs">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{{ mensagemErro() }}</span>
          </div>
          <button (click)="mensagemErro.set(null)" class="text-rose-700 hover:text-rose-900 font-bold p-1">&times;</button>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Coluna 1 & 2: Dados e Ações -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Card de Identificação Cadastral -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Identificação do Titular
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Nome Completo</span>
                <span class="text-slate-900 font-semibold text-xs mt-0.5 block">
                  {{ authService.currentUser()?.nome }}
                </span>
              </div>
              <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">E-mail Cadastrado</span>
                <span class="text-slate-900 font-semibold text-xs mt-0.5 block truncate">
                  {{ authService.currentUser()?.email }}
                </span>
              </div>
              <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Perfil de Acesso</span>
                <span class="text-slate-900 font-semibold text-xs mt-0.5 block">
                  {{ authService.currentUser()?.perfil }}
                </span>
              </div>
              <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mascaramento LGPD</span>
                <span class="text-slate-700 font-mono font-semibold text-xs mt-0.5 block">
                  {{ '12345678900' | mascararCpf }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card de Portabilidade de Dados (Art. 18, V) -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <div>
              <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Portabilidade dos Dados (Art. 18, V)
              </h2>
              <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                Você tem direito de obter uma cópia de todos os seus dados cadastrais, frequências de acesso, prescrições de treinos e faturas em formato digital interoperável (JSON).
              </p>
            </div>

            <div class="pt-1">
              <button
                type="button"
                (click)="exportarDados()"
                [disabled]="exportando()"
                class="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-xs flex items-center gap-2 min-h-[38px]"
              >
                @if (exportando()) {
                  <svg class="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Gerando Arquivo JSON...</span>
                } @else {
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Exportar Meus Dados (JSON)</span>
                }
              </button>
            </div>
          </div>

          <!-- Card de Anonimização / Direito ao Esquecimento (Art. 18, VI e Art. 16) -->
          <div class="bg-white border border-rose-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h2 class="text-sm font-bold text-rose-700 flex items-center gap-2">
              <svg class="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Anonimização & Direito ao Esquecimento
            </h2>
            <p class="text-xs text-slate-600 leading-relaxed">
              A anonimização desvincula permanentemente sua identidade dos registros cadastrais.
              Conforme o <strong>Art. 16, I da LGPD</strong> combinado com o <strong>Art. 173 do Código Tributário Nacional (CTN)</strong>,
              os registros fiscais de pagamentos são mantidos de forma descaracterizada pelo prazo legal obrigatório de 5 anos.
            </p>
            <div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800">
              <span class="font-bold">Aviso:</span> Esta ação é <strong>irreversível</strong>. Sua conta e acesso serão finalizados. Pendências financeiras ativas impedem a exclusão.
            </div>

            <div class="pt-1">
              <button
                type="button"
                (click)="abrirModalAnonimizacao()"
                class="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors shadow-xs flex items-center gap-2 min-h-[38px]"
              >
                <span>Solicitar Anonimização de Dados</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Coluna 3: Termo Vigente e Base Legal -->
        <div class="space-y-5">
          <!-- Card de Termo Vigente -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Termo Regulamentar
            </h3>
            @if (termo()) {
              <div class="space-y-2.5 text-xs text-slate-600">
                <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span class="text-slate-500 text-[11px]">Versão Vigente</span>
                  <span class="text-slate-900 font-mono font-bold">{{ termo()!.versao }}</span>
                </div>
                <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span class="text-slate-500 text-[11px]">Consentimento</span>
                  <span [class]="termo()!.jaAceito ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'">
                    {{ termo()!.jaAceito ? 'Registrado' : 'Pendente' }}
                  </span>
                </div>
                <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 leading-relaxed max-h-36 overflow-y-auto">
                  {{ termo()!.conteudo }}
                </div>
              </div>
            } @else {
              <p class="text-xs text-slate-400">Carregando informações regulamentares...</p>
            }
          </div>

          <!-- Card de Bases Legais Aplicadas -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Bases Legais (Art. 7º LGPD)
            </h3>
            <ul class="text-xs text-slate-600 space-y-2">
              <li class="flex items-start gap-1.5">
                <span class="text-slate-400 font-bold">•</span>
                <span><strong>Execução de Contrato:</strong> Gestão de planos, treinos e acesso físico à academia.</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-slate-400 font-bold">•</span>
                <span><strong>Obrigação Legal:</strong> Guarda de registros financeiros por 5 anos (CTN).</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-slate-400 font-bold">•</span>
                <span><strong>Consentimento:</strong> Notificações operacionais e comunicados do sistema.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação de Anonimização -->
      @if (modalAnonimizacaoAberto()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div class="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl animate-fade-in">
            <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900">Confirmação de Anonimização</h3>
                <span class="text-xs text-rose-600 font-medium">Ação Definitiva e Irreversível</span>
              </div>
            </div>

            <div class="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                Ao confirmar, todos os seus dados cadastrais (Nome, CPF, E-mail, Telefone, Histórico de Treinos) serão permanentemente descaracterizados.
              </p>
              <p class="text-slate-500">
                Faturas quitadas serão mantidas sem dados pessoais para cumprimento do Art. 173 do CTN.
              </p>
            </div>

            <label class="flex items-start gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="confirmouAnonimizacao"
                class="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span class="text-xs text-slate-700">
                Estou ciente de que não poderei recuperar minha conta e confirmo a anonimização definitiva.
              </span>
            </label>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                (click)="modalAnonimizacaoAberto.set(false)"
                [disabled]="anonimizando()"
                class="px-4 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs min-h-[38px]"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="executarAnonimizacao()"
                [disabled]="!confirmouAnonimizacao || anonimizando()"
                class="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-medium text-xs transition-colors shadow-xs flex items-center gap-2 min-h-[38px]"
              >
                @if (anonimizando()) {
                  <span>Anonimizando...</span>
                } @else {
                  <span>Confirmar e Anonimizar</span>
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PrivacidadePainelComponent implements OnInit {
  lgpdService = inject(LgpdService);
  authService = inject(AuthService);
  private router = inject(Router);

  termo = signal<TermoVigente | null>(null);
  exportando = signal(false);
  anonimizando = signal(false);
  modalAnonimizacaoAberto = signal(false);
  confirmouAnonimizacao = false;

  mensagemSucesso = signal<string | null>(null);
  mensagemErro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregarTermo();
  }

  carregarTermo(): void {
    this.lgpdService.obterTermoVigente().subscribe({
      next: (t) => this.termo.set(t),
      error: () => {}
    });
  }

  exportarDados(): void {
    this.exportando.set(true);
    this.mensagemSucesso.set(null);
    this.mensagemErro.set(null);

    this.lgpdService.exportarMeusDados().subscribe({
      next: (blob) => {
        this.exportando.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitmanager-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.mensagemSucesso.set('Arquivo JSON estruturado gerado e baixado com sucesso!');
      },
      error: (err) => {
        this.exportando.set(false);
        this.mensagemErro.set(err.error?.detail || 'Erro ao exportar dados pessoais.');
      }
    });
  }

  abrirModalAnonimizacao(): void {
    this.confirmouAnonimizacao = false;
    this.modalAnonimizacaoAberto.set(true);
  }

  executarAnonimizacao(): void {
    if (!this.confirmouAnonimizacao) return;
    this.anonimizando.set(true);
    this.mensagemErro.set(null);

    this.lgpdService.anonimizarMeusDados().subscribe({
      next: (res) => {
        this.anonimizando.set(false);
        this.modalAnonimizacaoAberto.set(false);
        alert(res.mensagem || 'Dados anonimizados com sucesso. Sua sessão será finalizada.');
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.anonimizando.set(false);
        this.modalAnonimizacaoAberto.set(false);
        this.mensagemErro.set(
          err.error?.detail || err.error?.message || 'Falha ao anonimizar: Verifique pendências financeiras ativas.'
        );
      }
    });
  }
}
