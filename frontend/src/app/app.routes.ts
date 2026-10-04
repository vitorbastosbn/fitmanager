import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { AlunoListComponent } from './features/alunos/aluno-list.component';
import { AlunoFormComponent } from './features/alunos/aluno-form.component';
import { PlanoCardsComponent } from './features/planos/plano-cards.component';
import { CobrancasTableComponent } from './features/financeiro/cobrancas-table.component';
import { AlunoQrCodeComponent } from './features/frequencia/aluno-qrcode.component';
import { TerminalScannerComponent } from './features/frequencia/terminal-scanner.component';
import { ExercicioCatalogoComponent } from './features/treinos/exercicio-catalogo.component';
import { FichaPrescricaoFormComponent } from './features/treinos/ficha-prescricao-form.component';
import { FichaVisualizacaoMobileComponent } from './features/treinos/ficha-visualizacao-mobile.component';
import { ColaboradorListComponent } from './features/colaboradores/colaborador-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },

  // Colaboradores (Gestão de Equipe)
  { path: 'colaboradores', component: ColaboradorListComponent, canActivate: [authGuard] },

  // Alunos
  { path: 'alunos', component: AlunoListComponent, canActivate: [authGuard] },
  { path: 'alunos/novo', component: AlunoFormComponent, canActivate: [authGuard] },

  // Planos e Matrículas
  { path: 'planos', component: PlanoCardsComponent, canActivate: [authGuard] },

  // Financeiro
  { path: 'financeiro', component: CobrancasTableComponent, canActivate: [authGuard] },

  // Frequência e Check-in
  { path: 'frequencia/meu-qrcode', component: AlunoQrCodeComponent, canActivate: [authGuard] },
  { path: 'frequencia/terminal', component: TerminalScannerComponent, canActivate: [authGuard] },

  // Treinos e Exercícios
  { path: 'treinos/exercicios', component: ExercicioCatalogoComponent, canActivate: [authGuard] },
  { path: 'treinos/prescrever', component: FichaPrescricaoFormComponent, canActivate: [authGuard] },
  { path: 'treinos/me', component: FichaVisualizacaoMobileComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];
