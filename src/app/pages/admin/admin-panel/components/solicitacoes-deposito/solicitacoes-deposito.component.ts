import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { SolicitacaoDeposito } from '../../../../../shared/models/solicitacao-deposito.model';
import { StatusSolicitacaoDeposito } from '../../../../../shared/enums/StatusSolicitacaoDeposito.enum';
import { StatusCampanha } from '../../../../../shared/enums/StatusCampanha.enum';
import { CampanhaService } from '../../../../../shared/services/campanha.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';

@Component({
  selector: 'app-solicitacoes-deposito',
  templateUrl: './solicitacoes-deposito.component.html',
  styleUrl: './solicitacoes-deposito.component.css',
})
export class SolicitacoesDepositoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() solicitacoes: SolicitacaoDeposito[] = [];
  @Input() loading: boolean = false;
  @Output() refresh = new EventEmitter<void>();
  selectedSolicitacao: SolicitacaoDeposito | null = null;
  modalDetalhes = false;
  modalAprovar = false;
  modalRejeitar = false;
  adminMessage = '';

  private destroy$ = new Subject<void>();

  statusOptions = [
    { label: 'Todas', value: '' },
    { label: 'Pendentes', value: StatusSolicitacaoDeposito.PENDING },
    { label: 'Aprovadas', value: StatusSolicitacaoDeposito.APPROVED },
    { label: 'Rejeitadas', value: StatusSolicitacaoDeposito.REJECTED },
    { label: 'Processadas', value: StatusSolicitacaoDeposito.PROCESSED },
  ];

  selectedStatus = '';

  constructor(
    private campanhaService: CampanhaService,
    private loadingService: LoadingService,
    private messageService: MessageConfirmationService
  ) {}

  ngOnInit() {
    // Dados são recebidos via @Input, não precisa carregar aqui
  }

  ngOnChanges(changes: SimpleChanges) {
    // Processa quando os dados são recebidos/alterados
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredSolicitacoes() {
    if (!this.selectedStatus) {
      return this.solicitacoes;
    }
    return this.solicitacoes.filter((s) => s.status === this.selectedStatus);
  }

  viewDetails(solicitacao: SolicitacaoDeposito) {
    this.selectedSolicitacao = solicitacao;
    this.modalDetalhes = true;
  }

  openAprovarModal(solicitacao: SolicitacaoDeposito) {
    this.selectedSolicitacao = solicitacao;
    this.adminMessage = '';
    this.modalAprovar = true;
  }

  openRejeitarModal(solicitacao: SolicitacaoDeposito) {
    this.selectedSolicitacao = solicitacao;
    this.adminMessage = '';
    this.modalRejeitar = true;
  }

  aprovarSolicitacao() {
    if (!this.selectedSolicitacao) return;

    if (this.selectedSolicitacao.campanha) {
      this.selectedSolicitacao.campanha.status = StatusCampanha.FINISHED;
    }

    this.modalAprovar = false;
    this.messageService.showMessage('Sucesso', 'Solicitação aprovada com sucesso!');

    // In real implementation, would call backend here:
    // this.campanhaService.updateSolicitacaoDeposito(this.selectedSolicitacao.id!, StatusSolicitacaoDeposito.APPROVED, this.adminMessage)
  }

  rejeitarSolicitacao() {
    if (!this.selectedSolicitacao || !this.adminMessage.trim()) {
      this.messageService.showWarning('Atenção', 'Por favor, informe o motivo da rejeição.');
      return;
    }

    // Update local state immediately
    this.selectedSolicitacao.status = StatusSolicitacaoDeposito.REJECTED;
    this.selectedSolicitacao.justification_admin = this.adminMessage;
    this.selectedSolicitacao.updated_at = new Date();

    this.modalRejeitar = false;
    this.messageService.showMessage('Sucesso', 'Solicitação rejeitada.');

    // In real implementation, would call backend here:
    // this.campanhaService.updateSolicitacaoDeposito(this.selectedSolicitacao.id!, StatusSolicitacaoDeposito.REJECTED, this.adminMessage)
  }

  marcarComoProcessada(solicitacao: SolicitacaoDeposito) {
    // Update local state immediately
    solicitacao.status = StatusSolicitacaoDeposito.PROCESSED;
    this.messageService.showMessage('Sucesso', 'Solicitação marcada como processada!');

    // In real implementation, would call backend here:
    // this.campanhaService.updateSolicitacaoDeposito(solicitacao.id!, StatusSolicitacaoDeposito.PROCESSED, 'Depósito realizado com sucesso')
  }

  getStatusSeverity(status: StatusSolicitacaoDeposito): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case StatusSolicitacaoDeposito.PROCESSED:
        return 'success';
      case StatusSolicitacaoDeposito.APPROVED:
        return 'info';
      case StatusSolicitacaoDeposito.REJECTED:
        return 'danger';
      case StatusSolicitacaoDeposito.PENDING:
        return 'warning';
      default:
        return 'info';
    }
  }

  getActionItems(solicitacao: SolicitacaoDeposito): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'Ver Detalhes',
        icon: 'pi pi-eye',
        command: () => this.viewDetails(solicitacao),
      },
    ];

    if (solicitacao.status === StatusSolicitacaoDeposito.PENDING) {
      items.push(
        {
          label: 'Aprovar',
          icon: 'pi pi-check',
          command: () => this.openAprovarModal(solicitacao),
        },
        {
          label: 'Rejeitar',
          icon: 'pi pi-times',
          command: () => this.openRejeitarModal(solicitacao),
        }
      );
    }

    if (solicitacao.status === StatusSolicitacaoDeposito.APPROVED) {
      items.push({
        label: 'Marcar como Processada',
        icon: 'pi pi-check-circle',
        command: () => this.marcarComoProcessada(solicitacao),
      });
    }

    return items;
  }
}

