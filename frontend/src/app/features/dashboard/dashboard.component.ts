import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardAdmin, DashboardRecepcao, DashboardInstrutor, DashboardAluno } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <!-- Topo com Boas-Vindas -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div class="relative z-10">
          <span class="text-xs uppercase tracking-widest font-black text-amber-500">Painel de Controle</span>
          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Olá, {{ authService.currentUser()?.nome }}!
          </h1>
          <p class="text-sm text-slate-400 mt-1">
            Visão geral em tempo real com métricas exclusivas do seu perfil.
          </p>
        </div>
        <div class="flex items-center gap-2 relative z-10">
          <span class="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
            Perfil: <span class="text-amber-400">{{ formatarPerfil(authService.currentUser()?.perfil) }}</span>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <svg class="animate-spin h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm font-medium">Carregando indicadores...</span>
        </div>
      }

      <!-- 1. DASHBOARD DO ADMINISTRADOR -->
      @if (!loading() && authService.currentUser()?.perfil === 'ROLE_ADMIN' && adminData()) {
        <div class="space-y-6">
          <!-- Grade de KPIs Financeiros e Operacionais -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Faturamento Mês Atual</span>
              <div class="text-2xl font-black text-emerald-400 mt-2">
                R$ {{ adminData()?.faturamentoMesAtual | number:'1.2-2' }}
              </div>
              <span class="text-[11px] text-slate-500 block mt-1">Mês anterior: R$ {{ adminData()?.faturamentoMesAnterior | number:'1.2-2' }}</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Total de Alunos Ativos</span>
              <div class="text-2xl font-black text-white mt-2">
                {{ adminData()?.totalAlunosAtivos }}
              </div>
              <span class="text-[11px] text-slate-500 block mt-1">Inativos: {{ adminData()?.totalAlunosInativos }}</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Check-ins de Hoje</span>
              <div class="text-2xl font-black text-amber-400 mt-2">
                {{ adminData()?.checkInsHoje }}
              </div>
              <span class="text-[11px] text-slate-500 block mt-1">Acessos registrados na catraca</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Taxa de Inadimplência</span>
              <div class="text-2xl font-black text-rose-400 mt-2">
                {{ adminData()?.taxaInadimplencia | number:'1.1-1' }}%
              </div>
              <span class="text-[11px] text-slate-500 block mt-1">Valor em aberto: R$ {{ adminData()?.valorEmAtraso | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Gráfico de Fluxo de Alunos por Horário -->
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-white">Fluxo de Alunos por Horário (Hoje)</h3>
                <p class="text-xs text-slate-400">Distribuição de entradas registradas nas catracas entre 06h e 22h</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Picos de Frequência
              </span>
            </div>

            <div class="grid grid-cols-9 sm:grid-cols-17 gap-1 pt-6 items-end h-40">
              @for (item of adminData()?.fluxoPorHorario; track item.hora) {
                <div class="flex flex-col items-center h-full justify-end group">
                  <div class="w-full rounded-t-lg bg-amber-500/20 group-hover:bg-amber-400 transition-all relative flex flex-col justify-end"
                       [style.height.%]="calcularAlturaBarra(item.quantidadeCheckIns)">
                    @if (item.quantidadeCheckIns > 0) {
                      <div class="w-full bg-amber-500 rounded-t-lg h-full opacity-80"></div>
                      <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-950 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {{ item.quantidadeCheckIns }}
                      </span>
                    }
                  </div>
                  <span class="text-[10px] text-slate-500 font-mono mt-2">{{ item.hora }}h</span>
                </div>
              }
            </div>
          </div>

          <!-- Ações Rápidas -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a routerLink="/alunos" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-3 text-white">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">A</div>
              <div>
                <div class="font-bold text-sm">Gerenciar Alunos</div>
                <div class="text-xs text-slate-400">Cadastros e fichas</div>
              </div>
            </a>
            <a routerLink="/colaboradores" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-3 text-white">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">C</div>
              <div>
                <div class="font-bold text-sm">Quadro de Colaboradores</div>
                <div class="text-xs text-slate-400">Equipe e CREF</div>
              </div>
            </a>
            <a routerLink="/financeiro" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center space-x-3 text-white">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">$</div>
              <div>
                <div class="font-bold text-sm">Controle Financeiro</div>
                <div class="text-xs text-slate-400">Faturas e pagamentos</div>
              </div>
            </a>
          </div>
        </div>
      }

      <!-- 2. DASHBOARD DA RECEPÇÃO -->
      @if (!loading() && (authService.currentUser()?.perfil === 'ROLE_RECEPCIONISTA') && recepcaoData()) {
        <div class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Check-ins Liberados</span>
              <div class="text-3xl font-black text-emerald-400 mt-2">{{ recepcaoData()?.checkInsHoje }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Acessos permitidos hoje</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Bloqueios na Catraca</span>
              <div class="text-3xl font-black text-rose-400 mt-2">{{ recepcaoData()?.bloqueiosHoje }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Inadimplência ou sem plano</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Faturas Vencendo Hoje</span>
              <div class="text-3xl font-black text-amber-400 mt-2">{{ recepcaoData()?.faturasVencendoHoje }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Cobranças para liquidação</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Matrículas a Renovar (7d)</span>
              <div class="text-3xl font-black text-indigo-400 mt-2">{{ recepcaoData()?.matriculasVencendoEm7Dias }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Alunos para renegociação</span>
            </div>
          </div>

          <!-- Histórico em Tempo Real de Check-in -->
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-white">Últimos Acessos Registrados</h3>
              <a routerLink="/frequencia/terminal" class="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20">
                Abrir Terminal de Catraca
              </a>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-slate-300">
                <thead class="bg-slate-950/60 text-xs uppercase text-slate-500 border-b border-slate-800">
                  <tr>
                    <th class="px-4 py-3">Aluno</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Motivo / Detalhes</th>
                    <th class="px-4 py-3 text-right">Horário</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  @for (chk of recepcaoData()?.ultimosCheckIns; track chk.id) {
                    <tr class="hover:bg-slate-800/30">
                      <td class="px-4 py-3 font-semibold text-white">{{ chk.alunoNome }}</td>
                      <td class="px-4 py-3">
                        @if (chk.status === 'LIBERADO') {
                          <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Liberado</span>
                        } @else {
                          <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Bloqueado</span>
                        }
                      </td>
                      <td class="px-4 py-3 text-xs text-slate-400">{{ chk.motivo || 'Acesso liberado com sucesso' }}</td>
                      <td class="px-4 py-3 text-right text-xs font-mono text-slate-400">{{ chk.dataHora | date:'HH:mm:ss' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- 3. DASHBOARD DO INSTRUTOR -->
      @if (!loading() && authService.currentUser()?.perfil === 'ROLE_INSTRUTOR' && instrutorData()) {
        <div class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Total de Alunos Ativos</span>
              <div class="text-3xl font-black text-white mt-2">{{ instrutorData()?.totalAlunosAtivos }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Na academia</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Fichas Prescritas</span>
              <div class="text-3xl font-black text-emerald-400 mt-2">{{ instrutorData()?.totalFichasPrescritas }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Treinos cadastrados no sistema</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Alunos Sem Ficha Ativa</span>
              <div class="text-3xl font-black text-amber-400 mt-2">{{ instrutorData()?.alunosSemFichaTreino }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Necessitam prescrição</span>
            </div>
          </div>

          <!-- Alunos Pendentes de Treino -->
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-white">Alunos Pendentes de Treino</h3>
              <a routerLink="/treinos/prescrever" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20">
                Prescrever Novo Treino
              </a>
            </div>

            @if (instrutorData()?.listaAlunosPendentes?.length === 0) {
              <div class="p-8 text-center text-slate-500">
                Parabéns! Todos os alunos ativos estão com treinos prescritos.
              </div>
            } @else {
              <div class="divide-y divide-slate-800/60">
                @for (pendente of instrutorData()?.listaAlunosPendentes; track pendente.alunoId) {
                  <div class="py-3 flex items-center justify-between">
                    <div>
                      <div class="font-bold text-white text-sm">{{ pendente.alunoNome }}</div>
                      <div class="text-xs text-slate-400">Aluno sem rotina de treino cadastrada</div>
                    </div>
                    <a routerLink="/treinos/prescrever" class="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold hover:bg-indigo-500/20 transition-colors">
                      Montar Treino
                    </a>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- 4. DASHBOARD DO ALUNO -->
      @if (!loading() && authService.currentUser()?.perfil === 'ROLE_ALUNO' && alunoData()) {
        <div class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Treinos Esta Semana</span>
              <div class="text-3xl font-black text-amber-400 mt-2">
                {{ alunoData()?.treinosSemanaAtual }} / 5
              </div>
              <span class="text-xs text-slate-500 mt-1 block">Consistência semanal</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Frequência no Mês</span>
              <div class="text-3xl font-black text-emerald-400 mt-2">
                {{ alunoData()?.totalCheckInsMes }} dias
              </div>
              <span class="text-xs text-slate-500 mt-1 block">Check-ins efetuados este mês</span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <span class="text-xs text-slate-400 font-semibold uppercase">Status da Matrícula</span>
              <div class="text-2xl font-black text-white mt-2">
                {{ alunoData()?.statusMatricula }}
              </div>
              <span class="text-xs text-slate-500 mt-1 block">Válida até {{ alunoData()?.dataVencimentoMatricula | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <!-- Próximo Treino & Atalho QR Code -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <span class="text-xs uppercase font-bold text-amber-500">Divisão do Dia</span>
              <h3 class="text-xl font-black text-white">Próximo Treino Sugerido</h3>
              <p class="text-sm text-slate-400">
                Acompanhe a execução das suas séries e registre suas cargas diretamente pelo celular.
              </p>
              <div class="pt-2">
                <a routerLink="/treinos/me" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20">
                  <span>Abrir Meu Treino</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <span class="text-xs uppercase font-bold text-emerald-400">Acesso à Academia</span>
                <h3 class="text-xl font-black text-white">Check-in na Catraca</h3>
                <p class="text-sm text-slate-400">
                  Gere seu QR Code temporário para liberar o acesso rápido na catraca.
                </p>
              </div>
              <div class="pt-2">
                <a routerLink="/frequencia/meu-qrcode" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20">
                  <span>Gerar QR Code</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  loading = signal(true);
  adminData = signal<DashboardAdmin | null>(null);
  recepcaoData = signal<DashboardRecepcao | null>(null);
  instrutorData = signal<DashboardInstrutor | null>(null);
  alunoData = signal<DashboardAluno | null>(null);

  ngOnInit(): void {
    const perfil = this.authService.currentUser()?.perfil;

    if (perfil === 'ROLE_ADMIN') {
      this.dashboardService.getAdminDashboard().subscribe({
        next: (data) => {
          this.adminData.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (perfil === 'ROLE_RECEPCIONISTA') {
      this.dashboardService.getRecepcaoDashboard().subscribe({
        next: (data) => {
          this.recepcaoData.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (perfil === 'ROLE_INSTRUTOR') {
      this.dashboardService.getInstrutorDashboard().subscribe({
        next: (data) => {
          this.instrutorData.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (perfil === 'ROLE_ALUNO') {
      this.dashboardService.getAlunoDashboard().subscribe({
        next: (data) => {
          this.alunoData.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.loading.set(false);
    }
  }

  calcularAlturaBarra(quantidade: number): number {
    if (!quantidade || quantidade === 0) return 5;
    return Math.min(100, Math.max(15, quantidade * 20));
  }

  formatarPerfil(perfil?: string): string {
    switch (perfil) {
      case 'ROLE_ADMIN': return 'Administrador';
      case 'ROLE_RECEPCIONISTA': return 'Recepção';
      case 'ROLE_INSTRUTOR': return 'Instrutor';
      case 'ROLE_ALUNO': return 'Aluno';
      default: return perfil || 'Usuário';
    }
  }
}
