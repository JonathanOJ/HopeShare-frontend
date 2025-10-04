import { StatusValidacaoDocumentos } from '../enums/StatusValidacaoDocumentos.enum';
import { AuthUser } from './auth';

export interface ValidacaoDocumento {
  validation_id: string;
  user_id: string;
  user_responsable?: AuthUser;
  status: StatusValidacaoDocumentos;
  cnpj: string;
  empresa_nome?: string;
  observation: string;
  observation_read: boolean;
  updated_at: Date;
  documentos: Documentos[];
}

export interface Documentos {
  name: string;
  url: string;
  file: File;
}

