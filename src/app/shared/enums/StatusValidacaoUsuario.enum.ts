export enum StatusValidacaoUsuario {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
}

export const StatusValidacaoUsuarioList = [
  { label: 'Pendente', value: StatusValidacaoUsuario.PENDING },
  { label: 'Aprovada', value: StatusValidacaoUsuario.APPROVED },
  { label: 'Rejeitada', value: StatusValidacaoUsuario.REJECTED },
  { label: 'Requer Ação', value: StatusValidacaoUsuario.REQUIRES_ACTION },
];

