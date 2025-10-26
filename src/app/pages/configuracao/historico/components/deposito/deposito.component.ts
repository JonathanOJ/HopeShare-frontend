import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';
import { SolicitacaoDeposito } from '../../../../../shared/models/solicitacao-deposito.model';
import {
  StatusSolicitacaoDeposito,
  StatusSolicitacaoDepositoList,
} from '../../../../../shared/enums/StatusSolicitacaoDeposito.enum';

@Component({
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  styleUrl: './deposito.component.css',
})
export class DepositoComponent {
  @Input() depositos: SolicitacaoDeposito[] = [];
  @Output() refresh = new EventEmitter<void>();

  loading = false;
  selectedDeposito: SolicitacaoDeposito | null = null;
  modalDetalhes = false;

  statusDepositList = StatusSolicitacaoDepositoList;

  statusOptions = [
    { label: 'Todas', value: '' },
    { label: 'Pendentes', value: StatusSolicitacaoDeposito.PENDING },
    { label: 'Aprovadas', value: StatusSolicitacaoDeposito.APPROVED },
    { label: 'Rejeitadas', value: StatusSolicitacaoDeposito.REJECTED },
    { label: 'Processadas', value: StatusSolicitacaoDeposito.PROCESSED },
  ];

  readonly StatusDeposito = StatusSolicitacaoDeposito;

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

  viewDetails(deposito: any): void {
    this.selectedDeposito = deposito;
    this.modalDetalhes = true;
  }
}

