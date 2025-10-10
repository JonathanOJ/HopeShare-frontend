export enum StatusDoacao {
  PENDING = 'pending', // O usuário ainda não concluiu o processo de pagamento
  APPROVED = 'approved', // O pagamento foi aprovado e creditado
  AUTHORIZED = 'authorized', // O pagamento foi autorizado, mas ainda não foi capturado
  IN_PROCESS = 'in_process', // O pagamento está em análise
  IN_MEDIATION = 'in_mediation', // O usuário iniciou uma disputa
  REJECTED = 'rejected', // O pagamento foi rejeitado (usuário pode tentar novamente)
  CANCELLED = 'cancelled', // O pagamento foi cancelado por uma das partes ou expirou
  REFUNDED = 'refunded', // O pagamento foi devolvido ao usuário
  CHARGED_BACK = 'charged_back', // Foi aplicado um chargeback no cartão de crédito do comprador
}

export const StatusDoacaoList = [
  { label: 'Pendente', value: StatusDoacao.PENDING },
  { label: 'Aprovado', value: StatusDoacao.APPROVED },
  { label: 'Autorizado', value: StatusDoacao.AUTHORIZED },
  { label: 'Em Análise', value: StatusDoacao.IN_PROCESS },
  { label: 'Em Mediação', value: StatusDoacao.IN_MEDIATION },
  { label: 'Rejeitado', value: StatusDoacao.REJECTED },
  { label: 'Cancelado', value: StatusDoacao.CANCELLED },
  { label: 'Reembolsado', value: StatusDoacao.REFUNDED },
  { label: 'Estornado', value: StatusDoacao.CHARGED_BACK },
];

export function getStatusDoacaoSeverity(status: StatusDoacao): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case StatusDoacao.APPROVED:
    case StatusDoacao.REFUNDED:
      return 'success';

    case StatusDoacao.PENDING:
    case StatusDoacao.AUTHORIZED:
    case StatusDoacao.IN_PROCESS:
      return 'warning';

    case StatusDoacao.REJECTED:
    case StatusDoacao.CANCELLED:
    case StatusDoacao.CHARGED_BACK:
      return 'danger';

    case StatusDoacao.IN_MEDIATION:
    default:
      return 'info';
  }
}

export function getStatusDoacaoLabel(status: StatusDoacao): string {
  const statusItem = StatusDoacaoList.find((item) => item.value === status);
  return statusItem?.label || status;
}

