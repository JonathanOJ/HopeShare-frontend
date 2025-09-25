export enum StatusSolicitacaoDeposito {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSED = 'PROCESSED',
}

export const StatusSolicitacaoDepositoList = [
  { label: 'Pendente', value: StatusSolicitacaoDeposito.PENDING },
  { label: 'Aprovada', value: StatusSolicitacaoDeposito.APPROVED },
  { label: 'Rejeitada', value: StatusSolicitacaoDeposito.REJECTED },
  { label: 'Processada', value: StatusSolicitacaoDeposito.PROCESSED },
];
