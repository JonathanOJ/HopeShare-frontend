import { Component, OnDestroy, Input, Output, EventEmitter, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { SolicitacaoDeposito } from '../../../../../shared/models/solicitacao-deposito.model';
import {
  StatusSolicitacaoDeposito,
  StatusSolicitacaoDepositoList,
} from '../../../../../shared/enums/StatusSolicitacaoDeposito.enum';
import { StatusCampanha } from '../../../../../shared/enums/StatusCampanha.enum';
import { CampanhaService } from '../../../../../shared/services/campanha.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';
import { AuthUser } from '../../../../../shared/models/auth';

@Component({
  selector: 'app-solicitacoes-deposito',
  templateUrl: './solicitacoes-deposito.component.html',
  styleUrl: './solicitacoes-deposito.component.css',
})
export class SolicitacoesDepositoComponent implements OnDestroy {
  @Input() userSession: AuthUser | null = null;
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

  statusDepositList = StatusSolicitacaoDepositoList;

  private campanhaService = inject(CampanhaService);
  private loadingService = inject(LoadingService);
  private messageService = inject(MessageConfirmationService);

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  updateStatus(payload: any, msgSuccess: string) {
    this.campanhaService
      .updateSolicitacaoDeposito(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.showMessage('Sucesso', msgSuccess);
          this.selectedSolicitacao!.status = payload.new_status;
          this.selectedSolicitacao!.justification_admin = payload.justification_admin;
          this.selectedSolicitacao!.updated_at = new Date();
          this.closeModals();
        },
        error: (error) => {
          const errorMsg = error.error.error || 'Erro ao atualizar status da solicitação.';
          this.messageService.showError('Erro', errorMsg);
        },
      });
  }

  closeModals() {
    this.modalAprovar = false;
    this.modalRejeitar = false;
    this.selectedSolicitacao = null;
    this.adminMessage = '';
  }

  aprovarSolicitacao() {
    if (!this.selectedSolicitacao) return;

    if (this.selectedSolicitacao.campanha) {
      this.selectedSolicitacao.campanha.status = StatusCampanha.FINISHED;
    }

    const payload = {
      new_status: StatusSolicitacaoDeposito.APPROVED,
      justification_admin: this.adminMessage,
      request_id: this.selectedSolicitacao.request_id!,
      user_id: this.userSession!.user_id,
    };

    this.updateStatus(payload, 'Solicitação aprovada com sucesso!');
  }

  rejeitarSolicitacao() {
    if (!this.selectedSolicitacao || !this.adminMessage.trim()) {
      this.messageService.showWarning('Atenção', 'Por favor, informe o motivo da rejeição.');
      return;
    }

    const payload = {
      new_status: StatusSolicitacaoDeposito.REJECTED,
      justification_admin: this.adminMessage,
      request_id: this.selectedSolicitacao.request_id!,
      user_id: this.userSession!.user_id,
    };

    this.updateStatus(payload, 'Solicitação rejeitada com sucesso!');
  }

  marcarComoProcessada(solicitacao: SolicitacaoDeposito) {
    this.loadingService.start();

    const payload = {
      new_status: StatusSolicitacaoDeposito.PROCESSED,
      justification_admin: 'Depósito realizado com sucesso',
      request_id: solicitacao.request_id!,
      user_id: this.userSession!.user_id,
    };

    this.updateStatus(payload, 'Solicitação processada com sucesso!');
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
    const items: MenuItem[] = [];

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

