import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StatusDoacao, StatusDoacaoList } from '../../../../../shared/enums/StatusDoacao.enum';
import { Doacao } from '../../../../../shared/models/doacao.model';

@Component({
  selector: 'app-doacao',
  templateUrl: './doacao.component.html',
  styleUrl: './doacao.component.css',
})
export class DoacaoComponent implements OnChanges {
  @Input() doacoes: Doacao[] = [];

  loading = false;
  selectedDoacao: Doacao | null = null;
  modalDetalhes = false;
  doacoesFiltered: Doacao[] = [];

  statusOptions = [{ label: 'Todas', value: '' }, ...StatusDoacaoList];

  selectedStatus = '';

  readonly StatusDoacao = StatusDoacao;

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['doacoes'] && this.doacoes) {
      console.log('Doações recebidas do componente pai:', this.doacoes);
      this.doacoesFiltered = [...this.doacoes]; // Criar uma cópia do array
      this.applyStatusFilter(); // Aplicar filtro atual se houver
    }
  }

  private applyStatusFilter(): void {
    if (!this.selectedStatus) {
      this.doacoesFiltered = [...this.doacoes];
    } else {
      this.doacoesFiltered = this.doacoes.filter((doacao) => doacao.status === this.selectedStatus);
    }
    console.log('Doações filtradas:', this.doacoesFiltered);
  }

  getStatusColor(status: string): string {
    return getStatusClass(status);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case StatusDoacao.PENDING:
        return 'Pendente';
      case StatusDoacao.APPROVED:
        return 'Aprovada';
      case StatusDoacao.REJECTED:
        return 'Rejeitada';
      case StatusDoacao.REFOUND_PENDING:
        return 'Reembolso Pendente';
      case StatusDoacao.REFOUND_REJECTED:
        return 'Reembolso Rejeitado';
      case StatusDoacao.REFOUND_APPROVED:
        return 'Reembolso Aprovado';
      default:
        return status;
    }
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case StatusDoacao.APPROVED:
        return 'success';
      case StatusDoacao.PENDING:
      case StatusDoacao.REFOUND_PENDING:
        return 'warning';
      case StatusDoacao.REJECTED:
      case StatusDoacao.REFOUND_REJECTED:
        return 'danger';
      case StatusDoacao.REFOUND_APPROVED:
        return 'info';
      default:
        return 'secondary';
    }
  }

  onStatusChange(): void {
    console.log('Filtro de status alterado para:', this.selectedStatus);
    this.applyStatusFilter();
  }

  viewDetails(doacao: any): void {
    this.selectedDoacao = doacao;
    this.modalDetalhes = true;
  }

  canRequestRefund(doacao: Doacao): boolean {
    if (doacao.status !== StatusDoacao.APPROVED) return false;
    if (this.isRefundRelated(doacao.status)) return false;

    const daysSinceDonation = Math.floor(
      (new Date().getTime() - new Date(doacao.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceDonation <= 180;
  }

  private isRefundRelated(status: string): boolean {
    return this.isRefundRelatedStatus(status);
  }

  isRefundRelatedStatus(status: string): boolean {
    return [StatusDoacao.REFOUND_PENDING, StatusDoacao.REFOUND_REJECTED, StatusDoacao.REFOUND_APPROVED].includes(
      status as StatusDoacao
    );
  }

  requestRefund(doacao: Doacao): void {
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(doacao.value);

    this.confirmationService.confirm({
      message: `Deseja realmente solicitar o reembolso da doação de ${valorFormatado} para a campanha "${doacao.title_campanha}"?`,
      header: 'Confirmar Reembolso',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, solicitar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.refoundDonation(doacao);
      },
    });
  }

  private refoundDonation(doacao: Doacao): void {
    console.log('Processando reembolso para doação:', doacao);

    doacao.status = StatusDoacao.REFOUND_APPROVED;
    doacao.refund_requested_at = new Date();

    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Reembolso Aprovado',
        detail: 'Seu reembolso foi aprovado com sucesso! O valor será estornado em até 5 dias úteis.',
      });
    }, 1000);
  }
}

