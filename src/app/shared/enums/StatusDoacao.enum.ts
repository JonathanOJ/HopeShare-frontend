export enum StatusDoacao {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFOUND_PENDING = 'REFOUND_PENDING',
  REFOUND_REJECTED = 'REFOUND_REJECTED',
  REFOUND_APPROVED = 'REFOUND_APPROVED',
}

export const StatusDoacaoList = [
  { label: 'Pendente', value: StatusDoacao.PENDING },
  { label: 'Aprovada', value: StatusDoacao.APPROVED },
  { label: 'Rejeitada', value: StatusDoacao.REJECTED },
  { label: 'Reembolso Pendente', value: StatusDoacao.REFOUND_PENDING },
  { label: 'Reembolso Rejeitado', value: StatusDoacao.REFOUND_REJECTED },
  { label: 'Reembolso Aprovado', value: StatusDoacao.REFOUND_APPROVED },
];

