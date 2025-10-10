import { StatusValidacaoUsuario } from '../enums/StatusValidacaoUsuario.enum';
import { AuthUser } from './auth';

export interface ValidacaoUsuario {
  validation_id: string;
  user?: AuthUser;
  status: StatusValidacaoUsuario;
  cnpj: string;
  company_name?: string;
  observation: string;
  observation_read: boolean;
  updated_at: Date;
  documents: Documentos[];
}

export interface Documentos {
  name: string;
  url: string;
  key: string;
  file: File;
}

