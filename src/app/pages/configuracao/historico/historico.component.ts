import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatusDoacao } from '../../../shared/enums/StatusDoacao.enum';
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

  @Output() getDepositosEvent = new EventEmitter<void>();
  @Output() getDoacoesEvent = new EventEmitter<void>();
}

