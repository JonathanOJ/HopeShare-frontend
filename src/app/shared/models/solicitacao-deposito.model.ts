import { Campanha } from './campanha.model';
import { AuthUser } from './auth';
import { StatusSolicitacaoDeposito } from '../enums/StatusSolicitacaoDeposito.enum';

export interface SolicitacaoDeposito {
  request_id?: string;
  status: StatusSolicitacaoDeposito;
  request_message?: string;
  justification_admin?: string;
  created_at?: Date;
  updated_at?: Date;
  campanha?: Campanha;
  user?: AuthUser;
}

export interface CreateSolicitacaoDepositoRequest {
  campanha: Campanha;
  user: AuthUser;
  request_message?: string;
}

export interface UpdateSolicitacaoDepositoRequest {
  request_id: string;
  status: StatusSolicitacaoDeposito;
  justification_admin?: string;
}

