export interface FluxoHorario {
  hora: number;
  quantidadeCheckIns: number;
}

export interface DashboardAdmin {
  totalAlunosAtivos: number;
  totalAlunosInativos: number;
  faturamentoMesAtual: number;
  faturamentoMesAnterior: number;
  valorEmAtraso: number;
  taxaInadimplencia: number;
  checkInsHoje: number;
  totalColaboradoresAtivos: number;
  fluxoPorHorario: FluxoHorario[];
}

export interface CheckInRecente {
  id: number;
  alunoNome: string;
  status: 'LIBERADO' | 'BLOQUEADO';
  motivo?: string;
  dataHora: string;
}

export interface DashboardRecepcao {
  checkInsHoje: number;
  bloqueiosHoje: number;
  faturasVencendoHoje: number;
  matriculasVencendoEm7Dias: number;
  ultimosCheckIns: CheckInRecente[];
}

export interface FichaPendente {
  alunoId: number;
  alunoNome: string;
  dataMatricula?: string;
}

export interface DashboardInstrutor {
  totalAlunosAtivos: number;
  totalFichasPrescritas: number;
  alunosSemFichaTreino: number;
  listaAlunosPendentes: FichaPendente[];
}

export interface ProximaFatura {
  id: number;
  valor: number;
  dataVencimento: string;
  status: string;
}

export interface DashboardAluno {
  treinosSemanaAtual: number;
  totalCheckInsMes: number;
  proximaDivisaoSugerida: string;
  statusMatricula: string;
  dataVencimentoMatricula?: string;
  proximaFatura?: ProximaFatura;
}
