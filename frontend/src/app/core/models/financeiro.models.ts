export type StatusCobranca = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
export type FormaPagamento = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

export interface Cobranca {
  id: number;
  matriculaId: number;
  alunoId: number;
  alunoNome: string;
  valor: number;
  dataVencimento: string;
  status: StatusCobranca;
}

export interface PagarCobrancaRequest {
  formaPagamento: FormaPagamento;
  valorPago: number;
  identificadorTransacao?: string;
  observacao?: string;
}

export interface PagamentoResponse {
  pagamentoId: number;
  cobrancaId: number;
  statusCobranca: StatusCobranca;
  valorPago: number;
  formaPagamento: FormaPagamento;
  dataHoraPagamento: string;
  recebedorNome: string;
  identificadorTransacao?: string;
}
