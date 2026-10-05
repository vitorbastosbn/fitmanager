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
    <div class="space-y-6">
      <!-- Topo com Boas-Vindas Corporativo -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[11px] uppercase tracking-wider font-bold text-slate-400">Painel Operacional</span>
            <span class="text-slate-300">&bull;</span>
            <span class="text-xs font-medium text-slate-600">Tempo Real</span>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Olá, {{ authService.currentUser()?.nome }}
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            Indicadores gerenciais e operacionais consolidados.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            Perfil: <strong class="text-slate-900">{{ formatarPerfil(authService.currentUser()?.perfil) }}</strong>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <svg class="animate-spin h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-xs font-medium">Carregando indicadores do sistema...</span>
        </div>
      }

      <!-- 1. DASHBOARD DO ADMINISTRADOR -->
      @if (!loading() && authService.currentUser()?.perfil === 'ROLE_ADMIN' && adminData()) {
        <div class="space-y-6">
          <!-- Grade de KPIs Financeiros e Operacionais -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Faturamento Mês Atual</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                R$ {{ adminData()?.faturamentoMesAtual | number:'1.2-2' }}
              </div>
              <span class="text-xs text-slate-500 block mt-1">Mês anterior: R$ {{ adminData()?.faturamentoMesAnterior | number:'1.2-2' }}</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total de Alunos Ativos</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                {{ adminData()?.totalAlunosAtivos }}
              </div>
              <span class="text-xs text-slate-500 block mt-1">Inativos cadastrados: {{ adminData()?.totalAlunosInativos }}</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Check-ins de Hoje</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                {{ adminData()?.checkInsHoje }}
              </div>
              <span class="text-xs text-slate-500 block mt-1">Acessos validados na catraca</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Taxa de Inadimplência</span>
              <div class="text-2xl font-bold text-rose-600 mt-2 tracking-tight">
                {{ adminData()?.taxaInadimplencia | number:'1.1-1' }}%
              </div>
              <span class="text-xs text-slate-500 block mt-1">Total em aberto: R$ {{ adminData()?.valorEmAtraso | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Gráfico de Fluxo de Alunos por Horário -->
          <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900">Fluxo de Acessos por Horário (Hoje)</h3>
                <p class="text-xs text-slate-500">Distribuição de entradas nas catracas entre 06h e 22h</p>
              </div>
              <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Picos de Frequência
              </span>
            </div>

            <div class="grid grid-cols-9 sm:grid-cols-17 gap-1.5 pt-6 items-end h-40 border-b border-slate-100 pb-2">
              @for (item of adminData()?.fluxoPorHorario; track item.hora) {
                <div class="flex flex-col items-center h-full justify-end group">
                  <div class="w-full rounded-t bg-slate-100 group-hover:bg-slate-200 transition-all relative flex flex-col justify-end"
                       [style.height.%]="calcularAlturaBarra(item.quantidadeCheckIns)">
                    @if (item.quantidadeCheckIns > 0) {
                      <div class="w-full bg-slate-800 group-hover:bg-slate-900 rounded-t h-full transition-colors"></div>
                      <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded shadow-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {{ item.quantidadeCheckIns }}
                      </span>
                    }
                  </div>
                  <span class="text-[10px] text-slate-400 font-mono mt-2">{{ item.hora }}h</span>
                </div>
              }
            </div>
          </div>

          <!-- Ações Rápidas Corporativas -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a routerLink="/alunos" class="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-center space-x-3 text-slate-900 shadow-xs group">
              <div class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs group-hover:bg-slate-200 transition-colors">AL</div>
              <div>
                <div class="font-semibold text-sm">Gerenciar Alunos</div>
                <div class="text-xs text-slate-500">Cadastros e fichas ativas</div>
              </div>
            </a>
            <a routerLink="/colaboradores" class="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-center space-x-3 text-slate-900 shadow-xs group">
              <div class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs group-hover:bg-slate-200 transition-colors">EQ</div>
              <div>
                <div class="font-semibold text-sm">Quadro de Colaboradores</div>
                <div class="text-xs text-slate-500">Instrutores, CREF e equipe</div>
              </div>
            </a>
            <a routerLink="/financeiro" class="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex items-center space-x-3 text-slate-900 shadow-xs group">
              <div class="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs group-hover:bg-slate-200 transition-colors">FIN</div>
              <div>
                <div class="font-semibold text-sm">Controle Financeiro</div>
                <div class="text-xs text-slate-500">Faturas, cobranças e baixas</div>
              </div>
            </a>
          </div>
        </div>
      }

      <!-- 2. DASHBOARD DA RECEPÇÃO -->
      @if (!loading() && (authService.currentUser()?.perfil === 'ROLE_RECEPCIONISTA') && recepcaoData()) {
        <div class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Check-ins Liberados</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{{ recepcaoData()?.checkInsHoje }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Acessos permitidos hoje</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Bloqueios na Catraca</span>
              <div class="text-2xl font-bold text-rose-600 mt-2 tracking-tight">{{ recepcaoData()?.bloqueiosHoje }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Inadimplência ou sem plano</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Faturas Vencendo Hoje</span>
              <div class="text-2xl font-bold text-amber-600 mt-2 tracking-tight">{{ recepcaoData()?.faturasVencendoHoje }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Cobranças para liquidação</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Matrículas a Renovar (7d)</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{{ recepcaoData()?.matriculasVencendoEm7Dias }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Alunos para renovação</span>
            </div>
          </div>

          <!-- Histórico em Tempo Real de Check-in -->
          <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900">Últimos Acessos Registrados</h3>
                <p class="text-xs text-slate-500">Monitoramento em tempo real da portaria/catraca</p>
              </div>
              <a routerLink="/frequencia/terminal" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs">
                Abrir Terminal de Catraca
              </a>
            </div>

            <div class="overflow-x-auto border border-slate-200 rounded-lg">
              <table class="w-full text-left text-sm text-slate-700">
                <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th class="px-4 py-3">Aluno</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Motivo / Detalhes</th>
                    <th class="px-4 py-3 text-right">Horário</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (chk of recepcaoData()?.ultimosCheckIns; track chk.id) {
                    <tr class="hover:bg-slate-50/60 transition-colors">
                      <td class="px-4 py-3 font-semibold text-slate-900">{{ chk.alunoNome }}</td>
                      <td class="px-4 py-3">
                        @if (chk.status === 'LIBERADO') {
                          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Liberado</span>
                        } @else {
                          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">Bloqueado</span>
                        }
                      </td>
                      <td class="px-4 py-3 text-xs text-slate-500">{{ chk.motivo || 'Acesso autorizado' }}</td>
                      <td class="px-4 py-3 text-right text-xs font-mono text-slate-500">{{ chk.dataHora | date:'HH:mm:ss' }}</td>
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
            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Total de Alunos Ativos</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{{ instrutorData()?.totalAlunosAtivos }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Matrículas ativas</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Fichas Prescritas</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{{ instrutorData()?.totalFichasPrescritas }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Rotinas ativas no sistema</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Alunos Sem Ficha Ativa</span>
              <div class="text-2xl font-bold text-amber-600 mt-2 tracking-tight">{{ instrutorData()?.alunosSemFichaTreino }}</div>
              <span class="text-xs text-slate-500 mt-1 block">Aguardando prescrição</span>
            </div>
          </div>

          <!-- Alunos Pendentes de Treino -->
          <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900">Alunos Pendentes de Prescrição</h3>
                <p class="text-xs text-slate-500">Alunos que ainda não possuem ficha de treino ativa</p>
              </div>
              <a routerLink="/treinos/prescrever" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs">
                Prescrever Novo Treino
              </a>
            </div>

            @if (instrutorData()?.listaAlunosPendentes?.length === 0) {
              <div class="p-8 text-center text-slate-500 text-xs">
                Todos os alunos ativos possuem fichas de treino prescritas.
              </div>
            } @else {
              <div class="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                @for (pendente of instrutorData()?.listaAlunosPendentes; track pendente.alunoId) {
                  <div class="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                    <div>
                      <div class="font-semibold text-slate-900 text-sm">{{ pendente.alunoNome }}</div>
                      <div class="text-xs text-slate-500">Aguardando rotina inicial ou renovação</div>
                    </div>
                    <a routerLink="/treinos/prescrever" class="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors">
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
            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Treinos Esta Semana</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                {{ alunoData()?.treinosSemanaAtual }} <span class="text-slate-400 text-base font-normal">/ 5 meta</span>
              </div>
              <span class="text-xs text-slate-500 mt-1 block">Frequência da semana atual</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Frequência no Mês</span>
              <div class="text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                {{ alunoData()?.totalCheckInsMes }} <span class="text-slate-400 text-base font-normal">dias</span>
              </div>
              <span class="text-xs text-slate-500 mt-1 block">Check-ins efetuados este mês</span>
            </div>

            <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Status da Matrícula</span>
              <div class="text-2xl font-bold text-emerald-600 mt-2 tracking-tight">
                {{ alunoData()?.statusMatricula }}
              </div>
              <span class="text-xs text-slate-500 mt-1 block">Válida até {{ alunoData()?.dataVencimentoMatricula | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <!-- Próximo Treino & Atalho QR Code -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span class="text-[11px] uppercase font-bold text-slate-400">Rotina de Exercícios</span>
                <h3 class="text-lg font-bold text-slate-900 mt-1">Meu Treino Prescrito</h3>
                <p class="text-xs text-slate-500 mt-1">
                  Acompanhe suas séries, registre cargas e repetições diretamente pelo smartphone.
                </p>
              </div>
              <div class="pt-2">
                <a routerLink="/treinos/me" class="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs">
                  <span>Visualizar Ficha de Treino</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span class="text-[11px] uppercase font-bold text-slate-400">Portaria & Acesso</span>
                <h3 class="text-lg font-bold text-slate-900 mt-1">Check-in na Catraca</h3>
                <p class="text-xs text-slate-500 mt-1">
                  Gere o código QR temporário de alta segurança para liberação imediata na recepção.
                </p>
              </div>
              <div class="pt-2">
                <a routerLink="/frequencia/meu-qrcode" class="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors shadow-xs">
                  <span>Gerar QR Code de Acesso</span>
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
