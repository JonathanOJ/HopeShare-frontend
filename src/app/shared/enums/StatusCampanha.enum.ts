export enum StatusCampanha {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
}

export const StatusCampanhaList = [
  { label: 'Ativa', value: StatusCampanha.ACTIVE },
  { label: 'Finalizada', value: StatusCampanha.FINISHED },
  { label: 'Cancelada', value: StatusCampanha.CANCELLED },
  { label: 'Suspensa', value: StatusCampanha.SUSPENDED },
];

