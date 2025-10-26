import { StatusDenuncia } from '../enums/StatusDenuncia.enum';
import { AuthUser } from './auth';

export interface Denuncia {
  report_id?: string;
  campanha: {
    campanha_id: string;
    title: string;
  };
  reason: string;
  description: string;
  created_at?: Date;
  status?: StatusDenuncia;
  user: AuthUser;
}

export const DenunciaReasons = [
  { label: 'Conteúdo Inadequado', value: 'CONTEUDO_INADEQUADO' },
  { label: 'Informações Falsas', value: 'INFORMACOES_FALSAS' },
  { label: 'Spam ou Propaganda', value: 'SPAM' },
  { label: 'Fraude Financeira', value: 'FRAUDE_FINANCEIRA' },
  { label: 'Violação de Direitos Autorais', value: 'DIREITOS_AUTORAIS' },
  { label: 'Outros', value: 'OUTROS' },
];

