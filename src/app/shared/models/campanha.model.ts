import { StatusCampanha } from '../enums/StatusCampanha.enum';
import { AuthUser } from './auth';
import { Comentario } from './comentario.model';
import { Denuncia } from './denuncia.model';
import { UserDonatedModel } from './user-donated.model';

export interface Campanha {
  campanha_id: string;
  title: string;
  description: string;
  image: Imagem;
  new_file_image?: File;
  category: string[];
  categoriesFormatted: string;
  users_donated: UserDonatedModel[];
  value_required: number;
  value_donated: number;
  emergency: boolean;
  user_responsable: AuthUser;
  created_at: Date | null;
  progress_percentage?: number;
  status: StatusCampanha;
  reason_suspension?: string;
  address: Endereco;
  have_address: boolean;
  comments: Comentario[];
}

export interface Imagem {
  url: string;
  key: string;
}
export interface Endereco {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipcode: string;
  neighborhood: string;
}

export interface DenunciaCampanhaGrouped {
  campanha_id: string;
  campanha_title: string;
  is_suspended?: boolean;
  total_denuncias: number;
  denuncias_pendentes: number;
  denuncias_analisadas: number;
  denuncias_resolvidas: number;
  denuncias: Denuncia[];
  expanded?: boolean;
}

