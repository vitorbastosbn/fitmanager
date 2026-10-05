export type PeriodicidadePlano = 'MENSAL' | 'TRIMESTRAL' | 'ANUAL';
export type StatusMatricula = 'ATIVA' | 'VENCIDA' | 'CANCELADA';

export interface Plano {
  id: number;
  nome: string;
  descricao?: string;
  valorMensalidade: number;
  periodicidade: PeriodicidadePlano;
  ativo: boolean;
}

export interface Matricula {
  id: number;
  alunoId: number;
  alunoNome: string;
  planoId: number;
  planoNome: string;
  dataInicio: string;
  dataTermino: string;
  valorMensalidadeContratada: number;
  status: StatusMatricula;
  dataCancelamento?: string;
  motivoCancelamento?: string;
}

export interface MatriculaCreate {
  alunoId: number;
  planoId: number;
  dataInicio: string;
}
