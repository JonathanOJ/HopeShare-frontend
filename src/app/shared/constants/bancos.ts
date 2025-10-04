import bancosListJson from './bancos-list.json';

export interface Banco {
  name: string;
  code: number | null;
  fullName: string;
}

export const BANCOS: Banco[] = Array.isArray(bancosListJson) ? bancosListJson : [];

export default BANCOS;

