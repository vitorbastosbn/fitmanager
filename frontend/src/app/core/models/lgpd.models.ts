export interface TermoVigente {
  id: number;
  versao: string;
  titulo: string;
  conteudo: string;
  obrigatorio: boolean;
  jaAceito: boolean;
}

export interface LogAuditoriaLgpd {
  id: number;
  operadorNome: string;
  titularNome: string;
  acao: string;
  detalhes: string;
  ipOrigem?: string;
  criadoEm: string;
}
