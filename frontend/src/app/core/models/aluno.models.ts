export type StatusAluno = 'ATIVO' | 'INATIVO' | 'TRANCADO';

export interface Endereco {
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface Aluno {
  id: number;
  usuarioId?: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  status: StatusAluno;
  endereco?: Endereco;
  createdAt?: string;
}

export interface AlunoCreate {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco?: Endereco;
}

export interface AlunoUpdate {
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  status?: StatusAluno;
  endereco?: Endereco;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
