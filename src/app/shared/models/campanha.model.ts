import { StatusCampanha } from '../enums/StatusCampanha.enum';
import { AuthUser } from './auth';
import { UserDonatedModel } from './userDonated.model';

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
  request_emergency: boolean;
  emergency: boolean;
  user_responsable: AuthUser;
  created_at: Date | null;
  progress_percentage?: number;
  status: StatusCampanha;
  reason_suspension?: string;
  address: Endereco;
  have_address: boolean;
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

