import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { CampanhaService } from '../../../shared/services/campanha.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageConfirmationService } from '../../../shared/services/message-confirmation.service';
import { SolicitacaoDeposito } from '../../../shared/models/solicitacao-deposito.model';
import { StatusSolicitacaoDeposito } from '../../../shared/enums/StatusSolicitacaoDeposito.enum';
import { StatusCampanha } from '../../../shared/enums/StatusCampanha.enum';

@Component({
  selector: 'app-solicitacoes-deposito',
  templateUrl: './solicitacoes-deposito.component.html',
  styleUrl: './solicitacoes-deposito.component.css',
})
export class SolicitacoesDepositoComponent implements OnInit, OnDestroy {
  solicitacoes: SolicitacaoDeposito[] = [];
  loading = false;
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
    this.loadSolicitacoes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSolicitacoes() {
    this.loading = true;

    this.solicitacoes = [
      {
        id: '1',
        campanha_id: 'camp1',
        user_id: 'user1',
        value_requested: 5000,
        status: StatusSolicitacaoDeposito.PENDING,
        request_message: 'Preciso do valor para comprar os medicamentos urgentemente.',
        created_at: new Date('2024-01-15'),
        campanha: {
          campanha_id: 'camp1',
          title: 'Ajuda para medicamentos',
          value_donated: 5200,
          value_required: 5000,
          status: StatusCampanha.ACTIVE,
        } as any,
        user: {
          user_id: 'user1',
          username: 'Maria Silva',
          email: 'maria@email.com',
        } as any,
      },
      {
        id: '2',
        campanha_id: 'camp2',
        user_id: 'user2',
        value_requested: 3500,
        status: StatusSolicitacaoDeposito.APPROVED,
        request_message: 'Campanha finalizada com sucesso, solicito o depósito.',
        admin_message: 'Solicitação aprovada. Processando depósito.',
        created_at: new Date('2024-01-10'),
        approved_at: new Date('2024-01-12'),
        campanha: {
          campanha_id: 'camp2',
          title: 'Construção de escola',
          value_donated: 3500,
          value_required: 3000,
          status: StatusCampanha.FINALIZADA,
        } as any,
        user: {
          user_id: 'user2',
          username: 'João Santos',
          email: 'joao@email.com',
        } as any,
      },
      {
        id: '3',
        campanha_id: 'camp3',
        user_id: 'user3',
        value_requested: 2000,
        status: StatusSolicitacaoDeposito.REJECTED,
        request_message: 'Solicito o depósito da campanha.',
        admin_message: 'Documentação incompleta. Favor enviar comprovantes.',
        created_at: new Date('2024-01-08'),
        rejected_at: new Date('2024-01-09'),
        campanha: {
          campanha_id: 'camp3',
          title: 'Ajuda para animais',
          value_donated: 2200,
          value_required: 2000,
          status: StatusCampanha.ACTIVE,
        } as any,
        user: {
          user_id: 'user3',
          username: 'Ana Costa',
          email: 'ana@email.com',
        } as any,
      },
    ];

    this.loading = false;

    /*
    this.campanhaService
      .getSolicitacoesDeposito()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (solicitacoes) => {
          this.solicitacoes = solicitacoes;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar solicitações:', error);
          this.messageService.showError('Erro', 'Erro ao carregar solicitações. Tente novamente.');
          this.loading = false;
        },
      });
    */
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

    this.loadingService.start();
    this.campanhaService
      .updateSolicitacaoDeposito(this.selectedSolicitacao.id!, StatusSolicitacaoDeposito.APPROVED, this.adminMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedSolicitacao!.status = StatusSolicitacaoDeposito.APPROVED;
          this.selectedSolicitacao!.admin_message = this.adminMessage;
          this.selectedSolicitacao!.approved_at = new Date();

          if (this.selectedSolicitacao!.campanha) {
            this.selectedSolicitacao!.campanha!.status = StatusCampanha.FINALIZADA;
          }

          this.modalAprovar = false;
          this.messageService.showMessage('Sucesso', 'Solicitação aprovada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao aprovar solicitação:', error);
          this.messageService.showError('Erro', 'Erro ao aprovar solicitação.');
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  rejeitarSolicitacao() {
    if (!this.selectedSolicitacao || !this.adminMessage.trim()) {
      this.messageService.showWarning('Atenção', 'Por favor, informe o motivo da rejeição.');
      return;
    }

    this.loadingService.start();
    this.campanhaService
      .updateSolicitacaoDeposito(this.selectedSolicitacao.id!, StatusSolicitacaoDeposito.REJECTED, this.adminMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedSolicitacao!.status = StatusSolicitacaoDeposito.REJECTED;
          this.selectedSolicitacao!.admin_message = this.adminMessage;
          this.selectedSolicitacao!.rejected_at = new Date();

          this.modalRejeitar = false;
          this.messageService.showMessage('Sucesso', 'Solicitação rejeitada.');
        },
        error: (error) => {
          console.error('Erro ao rejeitar solicitação:', error);
          this.messageService.showError('Erro', 'Erro ao rejeitar solicitação.');
        },
      })
      .add(() => {
        this.loadingService.done();
      });
  }

  marcarComoProcessada(solicitacao: SolicitacaoDeposito) {
    this.loadingService.start();
    this.campanhaService
      .updateSolicitacaoDeposito(solicitacao.id!, StatusSolicitacaoDeposito.PROCESSED, 'Depósito realizado com sucesso')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          solicitacao.status = StatusSolicitacaoDeposito.PROCESSED;
          this.messageService.showMessage('Sucesso', 'Solicitação marcada como processada!');
        },
        error: (error) => {
          console.error('Erro ao processar solicitação:', error);
          this.messageService.showError('Erro', 'Erro ao processar solicitação.');
        },
      })
      .add(() => {
        this.loadingService.done();
      });
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}

