import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { StatusValidacaoUsuario } from '../../../../../shared/enums/StatusValidacaoUsuario.enum';
import { MessageConfirmationService } from '../../../../../shared/services/message-confirmation.service';
import { Banco } from '../../../../../shared/models/banco.model';
import { ValidacaoUsuario } from '../../../../../shared/models/validacao-usuario';

@Component({
  selector: 'app-validacao-usuario',
  templateUrl: './validacao-usuario.component.html',
  styleUrl: './validacao-usuario.component.css',
})
export class ValidacaoUsuarioComponent implements OnInit {
  @Input() validacoesPendentes: ValidacaoUsuario[] = [];
  @Input() loading: boolean = false;
  @Output() refresh = new EventEmitter<void>();

  selectedValidation: ValidacaoUsuario | null = null;
  validationDecision: 'APPROVE' | 'REJECT' | null = null;
  observacaoAdmin: string = '';
  showValidationModal: boolean = false;

  private messageConfirmationService = inject(MessageConfirmationService);

  ngOnInit(): void {
    // Dados são recebidos via @Input, não precisa carregar aqui
  }

  refreshListEmit(): void {
    this.refresh.emit();
  }

  getBancoDisplay(banco: Banco): string {
    if (!banco) return '';
    return banco.code ? `${banco.code} - ${banco.name}` : banco.name;
  }

  openValidationModal(validation: ValidacaoUsuario): void {
    this.selectedValidation = validation;
    this.validationDecision = null;
    this.observacaoAdmin = '';
    this.showValidationModal = true;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      PENDENTE: 'Pendente',
      EM_ANALISE: 'Em Análise',
      RESOLVIDA: 'Resolvida',
      REJEITADA: 'Rejeitada',
      APROVADA: 'Aprovada',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'APPROVED':
      case 'RESOLVIDA':
      case 'APROVADA':
        return 'success';
      case 'PENDING':
      case 'PENDENTE':
        return 'warning';
      case 'REJECTED':
      case 'REJEITADA':
        return 'danger';
      default:
        return 'info';
    }
  }

  processValidation(): void {
    if (!this.selectedValidation || !this.validationDecision) return;

    this.loading = true;

    // Simular processamento
    setTimeout(() => {
      const status =
        this.validationDecision === 'APPROVE' ? StatusValidacaoUsuario.APPROVED : StatusValidacaoUsuario.REJECTED;

      this.showValidationModal = false;
      this.loading = false;

      this.messageConfirmationService.showMessage(
        'Validação Processada',
        `Documentos ${this.validationDecision === 'APPROVE' ? 'aprovados' : 'rejeitados'} com sucesso!`
      );

      this.selectedValidation = null;
    }, 1500);
  }
}

