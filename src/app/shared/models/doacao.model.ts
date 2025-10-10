import { StatusDoacao } from '../enums/StatusDoacao.enum';

export interface Doacao {
  payment_id: string;
  campanha_id: string;
  title_campanha?: string;
  user_id: string;
  amount: number;
  status: StatusDoacao;
  created_at: Date;
  updated_at: Date;
  refund_requested_at?: Date;
  payment_method?: string;
}

