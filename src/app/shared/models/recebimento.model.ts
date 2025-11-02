import { Banco } from './banco.model';

export interface Recebimento {
  receipt_id?: string;
  user_id?: string;
  bank: Banco;
  agency: string;
  account_number: string;
  account_type: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO';
  pix_key?: string; // Campo opcional
  cnpj: string;
  cnpj_verified: boolean;
  created_at?: Date;
  updated_at?: Date;
}

