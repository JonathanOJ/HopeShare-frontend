import { StatusDenuncia } from '../enums/StatusDenuncia.enum';

export interface Denuncia {
  id?: string;
  reason: string;
  description: string;
  created_at?: Date;
  status?: StatusDenuncia;
  user_id: string;
  campanha_id: string;
}

export interface CreateDenunciaRequest {
  reason: string;
  description: string;
}

export const DenunciaReasons = [
  { label: 'Conteúdo Inadequado', value: 'CONTEUDO_INADEQUADO' },
  { label: 'Informações Falsas', value: 'INFORMACOES_FALSAS' },
  { label: 'Spam ou Propaganda', value: 'SPAM' },
  { label: 'Fraude Financeira', value: 'FRAUDE_FINANCEIRA' },
  { label: 'Violação de Direitos Autorais', value: 'DIREITOS_AUTORAIS' },
  { label: 'Outros', value: 'OUTROS' },
];

