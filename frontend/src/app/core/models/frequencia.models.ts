export type StatusAcessoCheckin = 'LIBERADO' | 'BLOQUEADO';

export interface QrTokenResponse {
  token: string;
  segundosValidade: number;
  geradoEm: string;
}

export interface CheckInRequest {
  token: string;
}

export interface CheckInResponse {
  status: StatusAcessoCheckin;
  alunoId?: number;
  alunoNome?: string;
  dataHora?: string;
  planoNome?: string;
  motivo?: string;
  mensagem?: string;
}

export interface CheckInItem {
  id: number;
  alunoId: number;
  alunoNome: string;
  dataHora: string;
  status: StatusAcessoCheckin;
  motivoBloqueio?: string;
}
