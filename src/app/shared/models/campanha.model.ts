import { StatusCampanha } from '../enums/StatusCampanha.enum';
import { AuthUser } from './auth';
import { UserDonatedModel } from './userDonated.model';

export interface Campanha {
  campanha_id: string;
  title: string;
  description: string;
  image: string;
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
  address_street: string;
  address_number: string;
  address_complement: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_neighborhood: string;
  have_address: boolean;
}

