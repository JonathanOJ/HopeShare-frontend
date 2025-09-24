export function getStatusClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'aprovado':
    case 'confirmado':
      return 'bg-green-500';
    case 'pendente':
      return 'bg-yellow-500';
    case 'cancelado':
    case 'rejeitado':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
}
