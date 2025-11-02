import { AuthUser } from './auth';
import { Campanha } from './campanha.model';

export interface Relatorio {
  financial_report_id: string;
  campanha: Campanha;
  user: AuthUser;
  file_url: string;
  file_key: string;
  file_name: string;
  period_end: string;
  created_at: string;
  type: 'CONTABIL' | 'FINANCEIRO';
}

