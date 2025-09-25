import { Campanha } from './campanha.model';
import { AuthUser } from './auth';
import { StatusSolicitacaoDeposito } from '../enums/StatusSolicitacaoDeposito.enum';

export interface SolicitacaoDeposito {
  id?: string;
  campanha_id: string;
  user_id: string;
  value_requested: number;
  status: StatusSolicitacaoDeposito;
  request_message?: string;
  admin_message?: string;
  admin_id?: string;
  created_at?: Date;
  approved_at?: Date;
  rejected_at?: Date;
  campanha?: Campanha;
  user?: AuthUser;
  admin?: AuthUser;
}

export interface CreateSolicitacaoDepositoRequest {
  campanha_id: string;
  request_message?: string;
}

export interface UpdateSolicitacaoDepositoRequest {
  status: StatusSolicitacaoDeposito;
  admin_message?: string;
}

