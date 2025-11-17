import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Doacao } from '../../../shared/models/doacao.model';
import { SolicitacaoDeposito } from '../../../shared/models/solicitacao-deposito.model';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent {
  @Input() userIsCompany: boolean = false;
  @Input() depositos: SolicitacaoDeposito[] = [];
  @Input() doacoes: Doacao[] = [];

  isMobile: boolean = window.innerWidth < 768;

  @Output() getDepositosEvent = new EventEmitter<void>();
  @Output() getDoacoesEvent = new EventEmitter<void>();
}

