import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  StatusDoacao,
  StatusDoacaoList,
  getStatusDoacaoSeverity,
  getStatusDoacaoLabel,
} from '../../../../../shared/enums/StatusDoacao.enum';
import { Doacao } from '../../../../../shared/models/doacao.model';

@Component({
  selector: 'app-doacao',
  templateUrl: './doacao.component.html',
  styleUrl: './doacao.component.css',
})
export class DoacaoComponent implements OnChanges {
  @Input() doacoes: Doacao[] = [];

  @Output() refresh = new EventEmitter<void>();

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
    return getStatusDoacaoLabel(status as StatusDoacao);
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severity = getStatusDoacaoSeverity(status as StatusDoacao);
    // Mapear para os tipos suportados pelo componente
    return severity === 'info'
      ? 'info'
      : severity === 'success'
        ? 'success'
        : severity === 'warning'
          ? 'warning'
          : severity === 'danger'
            ? 'danger'
            : 'secondary';
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
    if (this.isRefundRelated(doacao)) return false;

    const daysSinceDonation = Math.floor(
      (new Date().getTime() - new Date(doacao.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceDonation <= 180;
  }

  isRefundRelated(doacao: Doacao): boolean {
    const last180days = new Date().getTime() - new Date(doacao.created_at).getTime() <= 1000 * 60 * 60 * 24 * 180;

    return [StatusDoacao.REFUNDED].includes(doacao.status as StatusDoacao) || !!last180days;
  }
  requestRefund(doacao: Doacao): void {
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(doacao.amount);

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

    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Reembolso Aprovado',
        detail: 'Seu reembolso foi aprovado com sucesso! O valor será estornado em até 5 dias úteis.',
      });
    }, 1000);
  }
}

