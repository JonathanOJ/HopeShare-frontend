import { Component, Input, OnInit } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';
import { SolicitacaoDeposito } from '../../../../../shared/models/solicitacao-deposito.model';
import { StatusSolicitacaoDeposito } from '../../../../../shared/enums/StatusSolicitacaoDeposito.enum';

@Component({
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  styleUrl: './deposito.component.css',
})
export class DepositoComponent implements OnInit {
  @Input() depositos: any[] = [];

  loading = false;
  selectedDeposito: any | null = null;
  modalDetalhes = false;

  statusOptions = [
    { label: 'Todas', value: '' },
    { label: 'Pendentes', value: StatusSolicitacaoDeposito.PENDING },
    { label: 'Aprovadas', value: StatusSolicitacaoDeposito.APPROVED },
    { label: 'Rejeitadas', value: StatusSolicitacaoDeposito.REJECTED },
    { label: 'Processadas', value: StatusSolicitacaoDeposito.PROCESSED },
  ];

  selectedStatus = '';

  // Exposer enum para uso no template
  readonly StatusDeposito = StatusSolicitacaoDeposito;

  constructor() {}

  ngOnInit() {
    // Sempre usar dados de exemplo padronizados com o novo enum
    // (remover esta lógica quando integrar com API real)
    this.createExampleData();
  }

  private createExampleData() {
    // Substituindo dados antigos do pai por dados padronizados com enum correto
    this.depositos = [
      {
        id: '1',
        campanha_id: 'camp1',
        user_id: 'user1',
        value_requested: 5000,
        valor: 5000, // formato legado
        status: StatusSolicitacaoDeposito.PENDING,
        request_message: 'Preciso do valor para comprar os medicamentos urgentemente.',
        observacao: 'Preciso do valor para comprar os medicamentos urgentemente.', // formato legado
        created_at: new Date('2024-01-15'),
        data: new Date('2024-01-15'), // formato legado
        nomeCampanha: 'Ajuda para medicamentos da Maria', // formato legado
        campanha: {
          campanha_id: 'camp1',
          title: 'Ajuda para medicamentos da Maria',
          value_donated: 5200,
          value_required: 5000,
          status: 'ACTIVE',
        },
      },
      {
        id: '2',
        campanha_id: 'camp2',
        user_id: 'user2',
        value_requested: 3000,
        valor: 3000,
        status: StatusSolicitacaoDeposito.APPROVED,
        request_message: 'Campanha finalizada com sucesso, solicito o valor arrecadado.',
        observacao: 'Campanha finalizada com sucesso, solicito o valor arrecadado.',
        created_at: new Date('2024-01-10'),
        data: new Date('2024-01-10'),
        approved_at: new Date('2024-01-12'),
        admin_message: 'Solicitação aprovada. Valor será processado em até 5 dias úteis.',
        nomeCampanha: 'Construção de casa popular',
        campanha: {
          campanha_id: 'camp2',
          title: 'Construção de casa popular',
          value_donated: 3500,
          value_required: 3000,
          status: 'COMPLETED',
        },
      },
      {
        id: '3',
        campanha_id: 'camp3',
        user_id: 'user3',
        value_requested: 1500,
        valor: 1500,
        status: StatusSolicitacaoDeposito.PROCESSED,
        request_message: 'Campanha de natal finalizada.',
        observacao: 'Campanha de natal finalizada.',
        created_at: new Date('2024-01-05'),
        data: new Date('2024-01-05'),
        approved_at: new Date('2024-01-06'),
        admin_message: 'Processado com sucesso.',
        nomeCampanha: 'Natal Solidário 2024',
        campanha: {
          campanha_id: 'camp3',
          title: 'Natal Solidário 2024',
          value_donated: 1800,
          value_required: 1500,
          status: 'COMPLETED',
        },
      },
      {
        id: '4',
        campanha_id: 'camp4',
        user_id: 'user4',
        value_requested: 2000,
        valor: 2000,
        status: StatusSolicitacaoDeposito.REJECTED,
        request_message: 'Solicitando valor da campanha.',
        observacao: 'Solicitando valor da campanha.',
        created_at: new Date('2024-01-01'),
        data: new Date('2024-01-01'),
        rejected_at: new Date('2024-01-03'),
        admin_message: 'Documentação incompleta. Favor enviar comprovantes solicitados.',
        nomeCampanha: 'Reforma do Centro Comunitário',
        campanha: {
          campanha_id: 'camp4',
          title: 'Reforma do Centro Comunitário',
          value_donated: 2200,
          value_required: 2000,
          status: 'ACTIVE',
        },
      },
    ];
  }

  getStatusColor(status: string): string {
    return getStatusClass(status);
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case StatusSolicitacaoDeposito.PENDING:
        return 'warning';
      case StatusSolicitacaoDeposito.APPROVED:
      case StatusSolicitacaoDeposito.PROCESSED:
        return 'success';
      case StatusSolicitacaoDeposito.REJECTED:
        return 'danger';
      default:
        return 'info';
    }
  }

  getFilteredDepositos(): any[] {
    if (!this.selectedStatus) {
      return this.depositos;
    }
    return this.depositos.filter((deposito) => deposito.status === this.selectedStatus);
  }

  onStatusChange(): void {
    // Lógica adicional se necessário quando o status muda
  }

  viewDetails(deposito: any): void {
    this.selectedDeposito = deposito;
    this.modalDetalhes = true;
  }
}

