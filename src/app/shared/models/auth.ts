export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  user_id: string;
  username: string;
  email: string;
  image: string;
  password: string;
  cnpj: string;
  cpf: string;
  type_user: TipoUsuario;
  is_admin: boolean;
  birthdate: Date | null;
  total_donated: number;
  total_campanha_donated: number;
  total_campanha_created: number;
  created_at: Date | null;
}

export interface InfoCampanhasUsuario {
  total_campanha_donated: number;
  total_campanha_created: number;
  total_donated: number;
}

export enum TipoUsuario {
  EMPRESA = 1,
  USER = 2,
}

export const TipoUsuarioList = [
  { label: 'Doador', value: TipoUsuario.USER },
  { label: 'Empresa', value: TipoUsuario.EMPRESA },
];
