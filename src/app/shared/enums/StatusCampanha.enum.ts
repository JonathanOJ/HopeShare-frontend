export enum StatusCampanha {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
  FINALIZADA = 'FINALIZADA',
}

export const StatusCampanhaList = [
  { label: 'Ativa', value: StatusCampanha.ACTIVE },
  { label: 'Finalizada', value: StatusCampanha.FINISHED },
  { label: 'Cancelada', value: StatusCampanha.CANCELLED },
  { label: 'Suspensa', value: StatusCampanha.SUSPENDED },
  { label: 'Finalizada com Depósito', value: StatusCampanha.FINALIZADA },
];

