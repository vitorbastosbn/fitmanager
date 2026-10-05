export type TipoPerfil = 'ROLE_ADMIN' | 'ROLE_RECEPCIONISTA' | 'ROLE_INSTRUTOR' | 'ROLE_ALUNO';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: TipoPerfil;
  ativo: boolean;
  primeiroAcesso: boolean;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: Usuario;
}

export interface AlterarSenhaRequest {
  novaSenha: string;
  confirmacaoNovaSenha: string;
}
