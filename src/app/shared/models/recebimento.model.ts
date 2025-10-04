import { Banco } from '../constants/bancos';

export interface Recebimento {
  recebimento_id?: string;
  banco: Banco;
  agency: string;
  account_number: string;
  account_type: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO';
  cnpj: string;
  created_at?: Date;
  updated_at?: Date;
  account_verified?: boolean;
  status?: 'PENDING' | 'VERIFIED';
}

