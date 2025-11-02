import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  StatusDoacao,
  StatusDoacaoList,
  getStatusDoacaoSeverity,
  getStatusDoacaoLabel,
} from '../../../../../shared/enums/StatusDoacao.enum';
import { Doacao } from '../../../../../shared/models/doacao.model';
import { DoacaoService } from '../../../../../shared/services/doacao.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-doacao',
  templateUrl: './doacao.component.html',
  styleUrl: './doacao.component.css',
})
export class DoacaoComponent implements OnChanges, OnDestroy {
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
  private doacaoService = inject(DoacaoService);

  private destroy$ = new Subject();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['doacoes'] && this.doacoes) {
      this.doacoesFiltered = [...this.doacoes];
      this.applyStatusFilter();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private applyStatusFilter(): void {
    if (!this.selectedStatus) {
      this.doacoesFiltered = [...this.doacoes];
    } else {
      this.doacoesFiltered = this.doacoes.filter((doacao) => doacao.status === this.selectedStatus);
    }
  }

  getStatusColor(status: string): string {
    return getStatusClass(status);
  }

  getStatusLabel(status: string): string {
    return getStatusDoacaoLabel(status as StatusDoacao);
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severity = getStatusDoacaoSeverity(status as StatusDoacao);
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
    return [StatusDoacao.REFUNDED].includes(doacao.status as StatusDoacao);
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
    const last180days = new Date().getTime() - new Date(doacao.created_at).getTime() <= 1000 * 60 * 60 * 24 * 180;

    if (!last180days) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro no Reembolso',
        detail: 'O período para solicitar reembolso expirou (máximo de 180 dias).',
      });
      return;
    }

    this.doacaoService
      .refundDonation(doacao.payment_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Reembolso Aprovado',
            detail: 'Seu reembolso foi aprovado com sucesso! O valor será estornado em até 5 dias úteis.',
          });
          this.refresh.emit();
        },
        error: (error) => {
          console.error('Erro ao processar reembolso:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Reembolso',
            detail: 'Ocorreu um erro ao processar o reembolso. Por favor, tente novamente mais tarde.',
          });
        },
      });
  }
}

