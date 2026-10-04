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
    <div class="space-y-8 max-w-5xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Lei 13.709/2018 (LGPD)
            </span>
            <span class="text-xs text-neutral-400">Direitos do Titular & Segurança</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight mt-1">
            Privacidade & Proteção de Dados
          </h1>
          <p class="text-sm text-neutral-400 mt-1">
            Gerencie o tratamento dos seus dados pessoais, solicite portabilidade digital ou exerça seu direito ao esquecimento.
          </p>
        </div>
      </div>

      <!-- Alert Messages -->
      @if (mensagemSucesso()) {
        <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">✓</span>
            <span>{{ mensagemSucesso() }}</span>
          </div>
          <button (click)="mensagemSucesso.set(null)" class="text-neutral-400 hover:text-white text-xs">✕</button>
        </div>
      }

      @if (mensagemErro()) {
        <div class="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚠</span>
            <span>{{ mensagemErro() }}</span>
          </div>
          <button (click)="mensagemErro.set(null)" class="text-neutral-400 hover:text-white text-xs">✕</button>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna 1 & 2: Dados e Ações -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Card de Identificação Cadastral -->
          <div class="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <span class="text-amber-500">👤</span>
              Identificação do Titular
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div class="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
                <span class="text-xs text-neutral-400 block font-medium">Nome Completo</span>
                <span class="text-white font-semibold text-base mt-0.5 block">
                  {{ authService.currentUser()?.nome }}
                </span>
              </div>
              <div class="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
                <span class="text-xs text-neutral-400 block font-medium">E-mail Cadastrado</span>
                <span class="text-white font-semibold text-base mt-0.5 block truncate">
                  {{ authService.currentUser()?.email }}
                </span>
              </div>
              <div class="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
                <span class="text-xs text-neutral-400 block font-medium">Perfil de Acesso</span>
                <span class="text-amber-400 font-semibold text-base mt-0.5 block">
                  {{ authService.currentUser()?.perfil }}
                </span>
              </div>
              <div class="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/80">
                <span class="text-xs text-neutral-400 block font-medium">Exemplo de Mascaramento LGPD</span>
                <span class="text-emerald-400 font-mono font-semibold text-base mt-0.5 block">
                  {{ '12345678900' | mascararCpf }} (Protegido)
                </span>
              </div>
            </div>
          </div>

          <!-- Card de Portabilidade de Dados (Art. 18, V) -->
          <div class="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                  <span class="text-sky-400">📦</span>
                  Portabilidade dos Dados (Art. 18, V)
                </h2>
                <p class="text-xs text-neutral-400 mt-1 max-w-xl">
                  Você tem direito de obter uma cópia de todos os seus dados pessoais, históricos de frequência na catraca, prescrições de treinos e faturas em formato digital estruturado e interoperável (JSON).
                </p>
              </div>
            </div>

            <div class="pt-2">
              <button
                type="button"
                (click)="exportarDados()"
                [disabled]="exportando()"
                class="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
              >
                @if (exportando()) {
                  <svg class="animate-spin h-4 w-4 text-neutral-950" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Gerando Pacote Estruturado...</span>
                } @else {
                  <span>📥 Exportar Meus Dados (JSON)</span>
                }
              </button>
            </div>
          </div>

          <!-- Card de Anonimização / Direito ao Esquecimento (Art. 18, VI e Art. 16) -->
          <div class="bg-rose-950/20 border border-rose-900/40 rounded-3xl p-6 space-y-4">
            <h2 class="text-lg font-bold text-rose-400 flex items-center gap-2">
              <span>🛑</span>
              Anonimização & Direito ao Esquecimento
            </h2>
            <p class="text-xs text-neutral-300 leading-relaxed">
              A anonimização desvincula permanentemente sua identidade dos registros cadastrais.
              Conforme o <strong>Art. 16, I da LGPD</strong> combinado com o <strong>Art. 173 do Código Tributário Nacional (CTN)</strong>,
              os registros fiscais e contábeis de pagamentos são mantidos de forma descaracterizada pelo prazo legal obrigatório de 5 anos.
            </p>
            <div class="bg-rose-900/10 border border-rose-800/40 rounded-2xl p-4 text-xs text-rose-300/90">
              <strong>Importante:</strong> Esta ação é <strong>irreversível</strong>. Sua conta será revogada, seu acesso ao aplicativo será desativado imediatamente e seu login deixará de existir. Caso existam faturas pendentes, a exclusão não será permitida até a quitação.
            </div>

            <div class="pt-2">
              <button
                type="button"
                (click)="abrirModalAnonimizacao()"
                class="px-5 py-3 rounded-2xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg shadow-rose-900/30 flex items-center gap-2"
              >
                <span>Excluir / Anonimizar Minha Conta</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Coluna 3: Termo Vigente e Base Legal -->
        <div class="space-y-6">
          <!-- Card de Termo Vigente -->
          <div class="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-4">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <span>📜</span>
              Termo Regulamentar
            </h3>
            @if (termo()) {
              <div class="space-y-3 text-xs text-neutral-300">
                <div class="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                  <span class="text-neutral-400 block text-[11px]">Versão Vigente</span>
                  <span class="text-amber-400 font-mono font-bold">{{ termo()!.versao }}</span>
                </div>
                <div class="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                  <span class="text-neutral-400 block text-[11px]">Status do Seu Aceite</span>
                  <span class="text-emerald-400 font-bold">
                    {{ termo()!.jaAceito ? '✓ Consentimento Registrado' : 'Pendente de Aceite' }}
                  </span>
                </div>
                <div class="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed max-h-40 overflow-y-auto">
                  {{ termo()!.conteudo }}
                </div>
              </div>
            } @else {
              <p class="text-xs text-neutral-500">Carregando informações regulamentares...</p>
            }
          </div>

          <!-- Card de Bases Legais Aplicadas -->
          <div class="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 space-y-3">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>⚖️</span>
              Bases Legais (Art. 7º LGPD)
            </h3>
            <ul class="text-xs text-neutral-400 space-y-2.5">
              <li class="flex items-start gap-2">
                <span class="text-amber-500 font-bold">•</span>
                <span><strong>Execução de Contrato:</strong> Gestão de planos, treinos e acesso físico à academia.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-amber-500 font-bold">•</span>
                <span><strong>Obrigação Legal:</strong> Guarda de registros financeiros por 5 anos (CTN).</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-amber-500 font-bold">•</span>
                <span><strong>Consentimento:</strong> Notificações operacionais e comunicados do sistema.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação de Anonimização -->
      @if (modalAnonimizacaoAberto()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div class="bg-neutral-900 border border-rose-900/60 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in">
            <div class="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                ⚠
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Confirmação de Anonimização</h3>
                <span class="text-xs text-rose-400 font-medium">Ação Definitiva e Irreversível</span>
              </div>
            </div>

            <div class="text-xs text-neutral-300 space-y-3 leading-relaxed">
              <p>
                Ao confirmar, todos os seus dados cadastrais (Nome, CPF, E-mail, Telefone, Histórico de Prescrições) serão permanentemente substituídos por registros anonimizados.
              </p>
              <p class="text-neutral-400">
                Suas faturas já quitadas serão mantidas sem identificação pessoal para cumprimento das exigências fiscais do Art. 173 do CTN.
              </p>
            </div>

            <label class="flex items-start gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="confirmouAnonimizacao"
                class="mt-0.5 rounded border-neutral-700 bg-neutral-900 text-rose-500 focus:ring-rose-500"
              />
              <span class="text-xs text-neutral-200">
                Estou ciente de que não poderei recuperar minha conta e concordo com a anonimização definitiva.
              </span>
            </label>

            <div class="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                (click)="modalAnonimizacaoAberto.set(false)"
                [disabled]="anonimizando()"
                class="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="executarAnonimizacao()"
                [disabled]="!confirmouAnonimizacao || anonimizando()"
                class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-lg shadow-rose-900/40 flex items-center gap-2"
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
