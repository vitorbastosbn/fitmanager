export type CargoPerfil = 'ROLE_ADMIN' | 'ROLE_INSTRUTOR' | 'ROLE_RECEPCIONISTA';
export type TurnoTrabalho = 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL';

export interface Colaborador {
  id: number;
  usuarioId?: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargoPerfil: CargoPerfil;
  cref?: string;
  turno: TurnoTrabalho;
  dataAdmissao: string;
  ativo: boolean;
  criadoEm?: string;
}

export interface ColaboradorCreate {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargoPerfil: CargoPerfil;
  cref?: string;
  turno?: TurnoTrabalho;
  dataAdmissao?: string;
}

export interface ColaboradorUpdate {
  nome: string;
  email: string;
  telefone: string;
  cargoPerfil: CargoPerfil;
  cref?: string;
  turno?: TurnoTrabalho;
}
