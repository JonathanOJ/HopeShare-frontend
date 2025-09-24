export enum StatusDenuncia {
  PENDING = 'PENDING',
  ANALYZED = 'ANALYZED',
  RESOLVED = 'RESOLVED',
}

export const StatusDenunciaList = [
  { label: 'Pendente', value: StatusDenuncia.PENDING },
  { label: 'Analisada', value: StatusDenuncia.ANALYZED },
  { label: 'Resolvida', value: StatusDenuncia.RESOLVED },
];
