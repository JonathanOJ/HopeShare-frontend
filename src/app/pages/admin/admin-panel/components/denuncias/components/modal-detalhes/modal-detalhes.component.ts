import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatusDenuncia } from '../../../../../../../shared/enums/StatusDenuncia.enum';
import { Denuncia } from '../../../../../../../shared/models/denuncia.model';

@Component({
  selector: 'app-modal-detalhes',
  templateUrl: './modal-detalhes.component.html',
  styleUrl: './modal-detalhes.component.css',
})
export class ModalDetalhesComponent {
  @Input() modalDetalhes: boolean = false;
  @Input() selectedDenuncia!: Denuncia;

  @Output() updateStatusEvent = new EventEmitter<string>();

  getStatusSeverity(status: StatusDenuncia): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case StatusDenuncia.RESOLVED:
        return 'success';
      case StatusDenuncia.ANALYZED:
        return 'warning';
      case StatusDenuncia.PENDING:
        return 'danger';
      default:
        return 'info';
    }
  }

  getReasonLabel(reason: string): string {
    const reasons: { [key: string]: string } = {
      CONTEUDO_INADEQUADO: 'Conteúdo Inadequado',
      INFORMACOES_FALSAS: 'Informações Falsas',
      SPAM: 'Spam ou Propaganda',
      FRAUDE_FINANCEIRA: 'Fraude Financeira',
      DIREITOS_AUTORAIS: 'Violação de Direitos Autorais',
      OUTROS: 'Outros',
    };
    return reasons[reason] || reason;
  }
}

