import { StatusDoacao } from '../enums/StatusDoacao.enum';

export interface Doacao {
  donation_id: string;
  campanha_id: string;
  title_campanha?: string;
  user_id: string;
  value: number;
  status: StatusDoacao;
  created_at: Date;
  refund_requested_at?: Date;
  payment_method?: string;
}

