export type GrupoMuscular = 'PEITO' | 'COSTAS' | 'PERNAS' | 'OMBROS' | 'BRACOS' | 'ABDOMEN' | 'CARDIO';
export type StatusFicha = 'ATIVA' | 'HISTORICO';

export interface Exercicio {
  id: number;
  nome: string;
  grupoMuscular: GrupoMuscular;
  instrucoes?: string;
  ativo: boolean;
}

export interface ItemDivisao {
  id: number;
  exercicioId: number;
  exercicioNome: string;
  grupoMuscular: GrupoMuscular;
  ordemExecucao: number;
  series: number;
  repeticoes: string;
  cargaKg: number;
  descansoSegundos: number;
  observacoes?: string;
}

export interface DivisaoTreino {
  id: number;
  letra: string;
  nome: string;
  ordem: number;
  itens: ItemDivisao[];
}

export interface FichaTreino {
  id: number;
  alunoId: number;
  alunoNome: string;
  instrutorId: number;
  instrutorNome: string;
  objetivo: string;
  dataInicio: string;
  dataValidade?: string;
  status: StatusFicha;
  divisoes: DivisaoTreino[];
}

export interface CriarItemDivisaoRequest {
  exercicioId: number;
  ordemExecucao?: number;
  series: number;
  repeticoes: string;
  cargaKg: number;
  descansoSegundos: number;
  observacoes?: string;
}

export interface CriarDivisaoRequest {
  letra: string;
  nome: string;
  ordem?: number;
  itens: CriarItemDivisaoRequest[];
}

export interface CriarFichaTreinoRequest {
  alunoId: number;
  objetivo: string;
  dataInicio: string;
  dataValidade?: string;
  divisoes: CriarDivisaoRequest[];
}

export interface RegistrarExecucaoRequest {
  itemDivisaoId: number;
  cargaUtilizadaKg: number;
  repeticoesRealizadas: number;
  seriesConcluidas: number;
  observacoes?: string;
}

export interface RegistroExecucaoResponse {
  id: number;
  alunoId: number;
  itemDivisaoId: number;
  exercicioNome: string;
  dataHoraExecucao: string;
  cargaUtilizadaKg: number;
  repeticoesRealizadas: number;
  seriesConcluidas: number;
}
