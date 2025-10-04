export enum StatusValidacaoDocumentos {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
}

export const StatusValidacaoDocumentosList = [
  { label: 'Pendente', value: StatusValidacaoDocumentos.PENDING },
  { label: 'Aprovada', value: StatusValidacaoDocumentos.APPROVED },
  { label: 'Rejeitada', value: StatusValidacaoDocumentos.REJECTED },
  { label: 'Requer Ação', value: StatusValidacaoDocumentos.REQUIRES_ACTION },
];

